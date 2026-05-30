import { Response } from 'express';
import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      res.status(403).json({ message: 'Only buyers can place orders' });
      return;
    }

    const { supplier, items, paymentMethod, shippingAddress, phone } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ message: 'No items in order' });
      return;
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Validate quantities against MOQ and calculate tier price
      let totalAmount = 0;
      const validatedItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product).session(session);
        if (!product) {
          res.status(404).json({ message: `Product ${item.product} not found` });
          await session.abortTransaction();
          session.endSession();
          return;
        }

        if (item.quantity < product.moq) {
          res.status(400).json({
            message: `Order quantity for ${product.title} must meet the minimum order quantity (MOQ) of ${product.moq}`,
          });
          await session.abortTransaction();
          session.endSession();
          return;
        }

        if (product.stock < item.quantity) {
          res.status(400).json({
            message: `Insufficient stock for product: ${product.title}. Available: ${product.stock}`,
          });
          await session.abortTransaction();
          session.endSession();
          return;
        }

        // Determine tiered price based on ordered quantity
        let pricePerUnit = product.priceTiers[0].pricePerUnit;
        // Sort price tiers by minQuantity descending to find matching tier
        const sortedTiers = [...product.priceTiers].sort((a, b) => b.minQuantity - a.minQuantity);
        
        for (const tier of sortedTiers) {
          if (item.quantity >= tier.minQuantity) {
            pricePerUnit = tier.pricePerUnit;
            break;
          }
        }

        totalAmount += pricePerUnit * item.quantity;
        validatedItems.push({
          product: product._id,
          quantity: item.quantity,
          price: pricePerUnit,
        });

        // Reduce stock
        await Product.findByIdAndUpdate(
          product._id,
          { $inc: { stock: -item.quantity } },
          { session }
        );
      }

      const [order] = await Order.create([{
        buyer: req.user.id,
        supplier,
        items: validatedItems,
        totalAmount,
        paymentMethod,
        shippingAddress,
        phone,
        paymentStatus: 'pending',
        deliveryStatus: 'processing',
      }], { session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json(order);
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBuyerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 20));
    const skip = (page - 1) * limit;

    const orders = await Order.find({ buyer: req.user.id })
      .populate('supplier', 'name companyName')
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ buyer: req.user.id });
    res.setHeader('X-Total-Count', total.toString());
    res.setHeader('X-Total-Pages', Math.ceil(total / limit).toString());
    res.setHeader('X-Page', page.toString());
    res.setHeader('X-Limit', limit.toString());

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSupplierOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'supplier') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 20));
    const skip = (page - 1) * limit;

    const orders = await Order.find({ supplier: req.user.id })
      .populate('buyer', 'name companyName')
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ supplier: req.user.id });
    res.setHeader('X-Total-Count', total.toString());
    res.setHeader('X-Total-Pages', Math.ceil(total / limit).toString());
    res.setHeader('X-Page', page.toString());
    res.setHeader('X-Limit', limit.toString());

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { deliveryStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Suppliers can update order details. Buyers can cancel if pending.
    if (req.user.role === 'supplier' && order.supplier.toString() !== req.user.id) {
      res.status(403).json({ message: 'Forbidden: You do not own this order' });
      return;
    }

    if (req.user.role === 'buyer' && order.buyer.toString() !== req.user.id) {
      res.status(403).json({ message: 'Forbidden: You do not own this order' });
      return;
    }

    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
