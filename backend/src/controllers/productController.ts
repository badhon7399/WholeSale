import { Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { AuthRequest } from '../middleware/auth';

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, search, minMoq, maxPrice, supplier, sort } = req.query;
    const query: any = {};

    // Filter by Category
    if (category) {
      const foundCategory = await Category.findOne({ slug: category });
      if (foundCategory) {
        query.category = foundCategory._id;
      } else {
        // Category slug doesn't exist, return empty array
        res.json({ products: [], total: 0 });
        return;
      }
    }

    // Filter by Supplier
    if (supplier) {
      query.supplier = supplier;
    }

    // Search Query (title, description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by Minimum Order Quantity (MOQ)
    if (minMoq) {
      query.moq = { $lte: Number(minMoq) };
    }

    // Filter by Maximum Price (checking the first tier's price)
    if (maxPrice) {
      query['priceTiers.0.pricePerUnit'] = { $lte: Number(maxPrice) };
    }

    // Define Sorting Option
    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOption = { 'priceTiers.0.pricePerUnit': 1 };
    } else if (sort === 'price_desc') {
      sortOption = { 'priceTiers.0.pricePerUnit': -1 };
    } else if (sort === 'moq_asc') {
      sortOption = { moq: 1 };
    } else if (sort === 'rating') {
      // Sort products by supplier rating
      // (This requires a lookup, for now fallback to title)
      sortOption = { title: 1 };
    }

    // Pagination
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 20));
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('category')
      .populate('supplier', 'name companyName rating reviewCount isVerified')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('supplier', 'name email companyName companyAddress rating reviewCount isVerified phone');

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'supplier') {
      res.status(403).json({ message: 'Only suppliers can list products' });
      return;
    }

    const { title, description, images, category, moq, priceTiers, specifications, stock, leadTime, shippingOrigin } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(400).json({ message: 'Category does not exist' });
      return;
    }

    const product = await Product.create({
      title,
      description,
      images: images || [],
      category,
      supplier: req.user.id,
      moq: Number(moq),
      priceTiers,
      specifications: specifications || {},
      stock: Number(stock),
      leadTime: leadTime || '7-15 days',
      shippingOrigin: shippingOrigin || 'Dhaka',
    });

    // Increment category product count
    await Category.findByIdAndUpdate(category, { $inc: { productCount: 1 } });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'supplier') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Verify supplier ownership
    if (product.supplier.toString() !== req.user.id) {
      res.status(403).json({ message: 'Forbidden: You do not own this product' });
      return;
    }

    const originalCategory = product.category;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Handle category count updates if category changed
    if (req.body.category && req.body.category !== originalCategory.toString()) {
      await Category.findByIdAndUpdate(originalCategory, { $inc: { productCount: -1 } });
      await Category.findByIdAndUpdate(req.body.category, { $inc: { productCount: 1 } });
    }

    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'supplier') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Verify supplier ownership
    if (product.supplier.toString() !== req.user.id) {
      res.status(403).json({ message: 'Forbidden: You do not own this product' });
      return;
    }

    // Decrement category product count
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });

    await Product.findByIdAndUpdate(req.params.id, { isDeleted: true, deletedAt: new Date() });

    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
