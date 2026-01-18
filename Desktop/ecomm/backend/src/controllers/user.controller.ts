import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import User from '../models/User.model.js';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, message: 'Нэвтрэх шаардлагатай' });
      return;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'Хэрэглэгч олдсонгүй' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
        email: user.email,
        name: user.name,
        role: user.role,
        address: user.address
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, message: 'Нэвтрэх шаардлагатай' });
      return;
    }
    const { name, address } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'Хэрэглэгч олдсонгүй' });
      return;
    }

    if (name) user.name = name;
    if (address) user.address = address;

    await user.save();

    res.json({
      success: true,
      message: 'Профайл амжилттай шинэчлэгдлээ',
      user: {
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
        email: user.email,
        name: user.name,
        role: user.role,
        address: user.address
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, message: 'Нэвтрэх шаардлагатай' });
      return;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'Хэрэглэгч олдсонгүй' });
      return;
    }

    const orders = await Order.find({ user: user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'Хэрэглэгч олдсонгүй' });
      return;
    }

    // Assuming favorites are stored in user model
    // For now, we'll need to add a favorites field to User model
    res.json({
      success: true,
      favorites: []
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Implementation for adding favorite
    res.json({ success: true, message: 'Дуртай бараанд нэмэгдлээ' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Implementation for removing favorite
    res.json({ success: true, message: 'Дуртай бараанаас хаслаа' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
