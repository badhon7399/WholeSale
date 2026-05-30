import { Request, Response } from 'express';
import { User } from '../models/User';
import { Product } from '../models/Product';

export const getSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 20));
    const skip = (page - 1) * limit;

    const suppliers = await User.find({ role: 'supplier' })
      .select('-password')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: 'supplier' });
    res.setHeader('X-Total-Count', total.toString());
    res.setHeader('X-Total-Pages', Math.ceil(total / limit).toString());
    res.setHeader('X-Page', page.toString());
    res.setHeader('X-Limit', limit.toString());

    res.json(suppliers);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplier = await User.findOne({ _id: req.params.id, role: 'supplier' }).select('-password');
    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    // Get all products listed by this supplier
    const products = await Product.find({ supplier: req.params.id }).populate('category');

    res.json({
      supplier,
      products
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
