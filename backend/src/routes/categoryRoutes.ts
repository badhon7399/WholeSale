import { Router, Response } from 'express';
import { Category } from '../models/Category';
import { AuthRequest } from '../middleware/auth';
import { authenticate, authorize } from '../middleware/auth';

import { publicCache } from '../middleware/cacheControl';

const router = Router();

// Get all categories
router.get('/', publicCache(300), async (req, res): Promise<void> => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create category (Admin only)
router.post('/', authenticate, authorize(['admin']), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, image } = req.body;
    
    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      res.status(400).json({ message: 'Category slug already exists' });
      return;
    }

    const category = await Category.create({ name, slug, image: image || '' });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
