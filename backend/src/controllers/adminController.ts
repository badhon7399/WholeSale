import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { RFQ } from '../models/RFQ';
import { Category } from '../models/Category';
import { logAuditEvent } from '../utils/auditLogger';

// Get Global Statistics
export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalSuppliers = await User.countDocuments({ role: 'supplier' });
    const verifiedSuppliers = await User.countDocuments({ role: 'supplier', isVerified: true });

    const totalProducts = await Product.countDocuments();
    const totalRfqs = await RFQ.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Sales volume calculation
    const salesAggregation = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          paidSales: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0]
            }
          }
        }
      }
    ]);

    const totalSales = salesAggregation[0]?.totalSales || 0;
    const paidSales = salesAggregation[0]?.paidSales || 0;

    // Recent activities logs
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const recentOrders = await Order.find()
      .populate('buyer', 'name companyName')
      .populate('supplier', 'companyName')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentRfqs = await RFQ.find()
      .populate('buyer', 'name companyName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      metrics: {
        totalUsers,
        totalBuyers,
        totalSuppliers,
        verifiedSuppliers,
        totalProducts,
        totalRfqs,
        totalOrders,
        totalSales,
        paidSales
      },
      recentUsers,
      recentOrders,
      recentRfqs
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching admin dashboard statistics', error: error.message });
  }
};

// Users management
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, role, isVerified } = req.query;
    let query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (isVerified) {
      query.isVerified = isVerified === 'true';
    }

    const users = await User.find(query).sort({ createdAt: -1 }).select('-password');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch users list', error: error.message });
  }
};

export const verifyUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isVerified },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (req.user) {
      await logAuditEvent({
        action: 'VERIFY_USER',
        performedBy: req.user.id,
        targetEntity: 'User',
        targetId: user._id.toString(),
        details: { isVerified },
        ipAddress: req.ip,
      });
    }

    res.json({ message: 'Supplier verification status updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to verify user', error: error.message });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['buyer', 'supplier', 'admin'].includes(role)) {
      res.status(400).json({ message: 'Invalid role assignment' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (req.user) {
      await logAuditEvent({
        action: 'UPDATE_USER_ROLE',
        performedBy: req.user.id,
        targetEntity: 'User',
        targetId: user._id.toString(),
        details: { role },
        ipAddress: req.ip,
      });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (req.user) {
      await logAuditEvent({
        action: 'DELETE_USER',
        performedBy: req.user.id,
        targetEntity: 'User',
        targetId: user._id.toString(),
        details: { name: user.name, email: user.email, role: user.role },
        ipAddress: req.ip,
      });
    }

    res.json({ message: 'User account removed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// Products management
export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    let query: any = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .populate('supplier', 'companyName name')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (req.user) {
      await logAuditEvent({
        action: 'DELETE_PRODUCT',
        performedBy: req.user.id,
        targetEntity: 'Product',
        targetId: product._id.toString(),
        details: { title: product.title },
        ipAddress: req.ip,
      });
    }

    res.json({ message: 'Product listing removed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

// RFQs management
export const getRfqs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    let query: any = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const rfqs = await RFQ.find(query)
      .populate('buyer', 'name companyName')
      .sort({ createdAt: -1 });

    res.json(rfqs);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch RFQs', error: error.message });
  }
};

export const deleteRfq = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const rfq = await RFQ.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });

    if (!rfq) {
      res.status(404).json({ message: 'RFQ not found' });
      return;
    }

    if (req.user) {
      await logAuditEvent({
        action: 'DELETE_RFQ',
        performedBy: req.user.id,
        targetEntity: 'RFQ',
        targetId: rfq._id.toString(),
        details: { title: rfq.title },
        ipAddress: req.ip,
      });
    }

    res.json({ message: 'RFQ removed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete RFQ', error: error.message });
  }
};

// Orders management
export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('buyer', 'companyName name email')
      .populate('supplier', 'companyName name')
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { deliveryStatus, paymentStatus } = req.body;

    let updates: any = {};
    if (deliveryStatus) updates.deliveryStatus = deliveryStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(id, updates, { new: true });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (req.user) {
      await logAuditEvent({
        action: 'UPDATE_ORDER_STATUS',
        performedBy: req.user.id,
        targetEntity: 'Order',
        targetId: order._id.toString(),
        details: updates,
        ipAddress: req.ip,
      });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

// Edit User details
export const editUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, companyName, email, phone, tradeLicense } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, companyName, email, phone, tradeLicense },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User details updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// Edit Product details
export const editProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, stock, moq, basePrice } = req.body;

    const priceTiers = [{ minQuantity: Number(moq) || 1, pricePerUnit: Number(basePrice) || 0 }];

    const product = await Product.findByIdAndUpdate(
      id,
      { title, stock: Number(stock) || 0, moq: Number(moq) || 1, priceTiers },
      { new: true }
    );

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// Edit RFQ details
export const editRfq = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, quantity, targetPrice } = req.body;

    const rfq = await RFQ.findByIdAndUpdate(
      id,
      { title, quantity: Number(quantity) || 1, targetPrice: Number(targetPrice) || 0 },
      { new: true }
    );

    if (!rfq) {
      res.status(404).json({ message: 'RFQ not found' });
      return;
    }

    res.json({ message: 'RFQ updated successfully', rfq });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update RFQ', error: error.message });
  }
};

// Edit Category details
export const editCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, image } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, image },
      { new: true }
    );

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.json({ message: 'Category updated successfully', category });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

// Delete Category
export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.json({ message: 'Category removed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

