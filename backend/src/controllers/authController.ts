import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { env } from '../config/env';
import { setAuthCookie, clearAuthCookie } from '../utils/cookies';

const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, companyName, companyAddress, tradeLicense, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // For buyers, automatically verify. For suppliers, require trade license or keep false until review.
    const isVerified = role === 'buyer';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'buyer',
      companyName: companyName || '',
      companyAddress: companyAddress || '',
      tradeLicense: tradeLicense || '',
      phone: phone || '',
      isVerified,
    });

    const token = generateToken(user._id.toString(), user.role);
    setAuthCookie(res, token);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        isVerified: user.isVerified,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);
    setAuthCookie(res, token);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        isVerified: user.isVerified,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    clearAuthCookie(res);
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
