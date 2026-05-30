import { Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { RFQ } from '../models/RFQ';
import { AuthRequest } from '../middleware/auth';

export const getSupplierStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'supplier') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const supplierId = req.user.id;

    // Total Products
    const totalProducts = await Product.countDocuments({ supplier: supplierId });

    // Orders stats
    const orders = await Order.find({ supplier: supplierId });
    const totalOrders = orders.length;

    const totalSales = orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrdersCount = orders.filter(
      (o) => o.deliveryStatus === 'processing' || o.deliveryStatus === 'shipped'
    ).length;

    // Recent orders
    const recentOrders = await Order.find({ supplier: supplierId })
      .populate('buyer', 'name companyName')
      .limit(5)
      .sort({ createdAt: -1 });

    // Count open RFQs that match the supplier's product categories
    // For simplicity, we just count all open RFQs
    const openRfqsCount = await RFQ.countDocuments({ status: 'open' });

    res.json({
      totalProducts,
      totalOrders,
      totalSales,
      pendingOrdersCount,
      openRfqsCount,
      recentOrders,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBuyerStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'buyer') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const buyerId = req.user.id;

    // Total Orders Placed
    const orders = await Order.find({ buyer: buyerId });
    const totalOrders = orders.length;
    const totalSpent = orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Total RFQs Posted
    const totalRfqs = await RFQ.countDocuments({ buyer: buyerId });
    const openRfqs = await RFQ.find({ buyer: buyerId, status: 'open' });

    // Open bids on their RFQs
    let totalBidsReceived = 0;
    openRfqs.forEach((rfq) => {
      totalBidsReceived += rfq.bids.length;
    });

    // Recent orders
    const recentOrders = await Order.find({ buyer: buyerId })
      .populate('supplier', 'name companyName')
      .limit(5)
      .sort({ createdAt: -1 });

    res.json({
      totalOrders,
      totalSpent,
      totalRfqs,
      totalBidsReceived,
      recentOrders,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
