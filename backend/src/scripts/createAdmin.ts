import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI is not defined in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const email = 'admin@wholesale.com';
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating role and verification to ensure admin status...');
      existingAdmin.role = 'admin';
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log('Admin user successfully updated.');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const adminUser = await User.create({
        name: 'System Admin',
        email,
        password: hashedPassword,
        role: 'admin',
        companyName: 'Wholesale B2B HQ',
        companyAddress: 'Dhaka, Bangladesh',
        phone: '+8801700000000',
        isVerified: true
      });
      console.log('Admin user created successfully:', adminUser.email);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
