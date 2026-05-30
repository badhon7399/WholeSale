import { Router, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import { env } from '../config/env';

const router = Router();

// Multer configuration with file type and size restrictions
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'));
    }
  },
});

// Configure Cloudinary
if (!env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME || 'demo',
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Safely remove a temp file from disk.
 */
const cleanupTempFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Failed to cleanup temp file:', filePath, err);
  }
};

router.post('/', authenticate, upload.single('image'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    if (!env.isCloudinaryConfigured || env.CLOUDINARY_CLOUD_NAME === 'demo') {
      console.log('Cloudinary not configured or using demo. Returning mock upload URL.');
      cleanupTempFile(req.file.path);
      res.json({
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      });
      return;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'wholesale_b2b',
    });

    // Cleanup temp file after successful upload
    cleanupTempFile(req.file.path);

    res.json({ url: result.secure_url });
  } catch (error: any) {
    // Cleanup temp file on error too
    if (req.file?.path) {
      cleanupTempFile(req.file.path);
    }
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

export default router;
