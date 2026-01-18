import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectDB } from './config/database.js';
import User from './models/User.model.js';
import Category from './models/Category.model.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultCategories = [
  { name: 'Бичиг хэрэг', nameEn: 'Stationery' },
  { name: 'Утасны дагалдах', nameEn: 'Phone Accessories' },
  { name: 'Тоглоом', nameEn: 'Toys' },
  { name: 'Гэр ахуй', nameEn: 'Home Goods' },
  { name: 'Цахилгаан бараа', nameEn: 'Electronics' },
  { name: 'Жааз', nameEn: 'Frames' },
  { name: 'Бэлэг дурсгал', nameEn: 'Souvenirs' },
];

const seedAdmin = async () => {
  try {
    await connectDB();
    
    // Seed admin user
    const existingAdmin = await User.findOne({ email: 'n.munkhpurev@gmail.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('8980', 10);
      
      const admin = new User({
        clerkId: 'admin-seed-' + Date.now(),
        phoneNumber: '99958980',
        email: 'n.munkhpurev@gmail.com',
        name: 'Админ',
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    // Seed default categories
    for (const cat of defaultCategories) {
      const existingCategory = await Category.findOne({ name: cat.name });
      if (!existingCategory) {
        const category = new Category({
          name: cat.name,
          nameEn: cat.nameEn,
          isActive: true
        });
        await category.save();
        console.log(`Category "${cat.name}" created`);
      }
    }
    console.log('Default categories seeded');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
};

seedAdmin();
