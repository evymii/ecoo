import { Request, Response } from 'express';
import Product from '../models/Product.model.js';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Бараа олдсонгүй' });
      return;
    }
    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({
      $or: [
        { 'features.isNew': true },
        { 'features.isFeatured': true }
      ]
    }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDiscountedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ 'features.isDiscounted': true })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
