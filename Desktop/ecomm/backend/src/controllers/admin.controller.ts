import { Request, Response } from 'express';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const orders = await Order.find();
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        revenue
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      res.status(400).json({ success: false, message: 'Буруу эрх' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'Хэрэглэгч олдсонгүй' });
      return;
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: 'Хэрэглэгчийн эрх амжилттай шинэчлэгдлээ',
      user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, description, price, category, stock, features, mainImageIndex } = req.body;

    if (!code || !name || !description || !price || !category || stock === undefined) {
      res.status(400).json({ 
        success: false, 
        message: 'Бүх талбарыг бөглөнө үү',
        missing: {
          code: !code,
          name: !name,
          description: !description,
          price: !price,
          category: !category,
          stock: stock === undefined
        }
      });
      return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'Хамгийн багадаа 1 зураг оруулна уу' });
      return;
    }

    // Parse features if it's a string
    let parsedFeatures: any = {
      isNew: false,
      isFeatured: false,
      isDiscounted: false
    };

    if (features) {
      try {
        parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      } catch (e) {
        // If parsing fails, use default
        console.error('Error parsing features:', e);
      }
    }

    // Helper function to convert to boolean
    const toBoolean = (value: any): boolean => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') return value === 'true';
      return Boolean(value);
    };

    const mainIdx = parseInt(mainImageIndex || '0', 10);
    const productImages = files.map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      isMain: index === mainIdx,
      order: index
    }));

    const product = new Product({
      code: code.toString().trim(),
      name: name.toString().trim(),
      description: description.toString().trim(),
      price: parseFloat(price.toString()),
      category: category.toString().trim(),
      stock: parseInt(stock.toString(), 10),
      images: productImages,
      features: {
        isNew: toBoolean(parsedFeatures.isNew),
        isFeatured: toBoolean(parsedFeatures.isFeatured),
        isDiscounted: toBoolean(parsedFeatures.isDiscounted)
      }
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Бараа амжилттай нэмэгдлээ',
      product
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Энэ барааны код аль хэдийн үүссэн байна' });
      return;
    }
    res.status(500).json({ success: false, message: error.message || 'Бараа нэмэхэд алдаа гарлаа' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { code, name, description, price, category, stock, features, images, mainImageIndex } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Бараа олдсонгүй' });
      return;
    }

    if (code) product.code = code;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (features) {
      // Helper function to convert to boolean
      const toBoolean = (value: any): boolean => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') return value === 'true';
        return Boolean(value);
      };

      product.features = {
        isNew: toBoolean(features.isNew),
        isFeatured: toBoolean(features.isFeatured),
        isDiscounted: toBoolean(features.isDiscounted)
      };
    }

    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      const newImages = files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        isMain: index === parseInt(mainImageIndex || '0'),
        order: product.images.length + index
      }));
      product.images = [...product.images, ...newImages].slice(0, 10);
    }

    if (mainImageIndex !== undefined && product.images.length > 0) {
      product.images.forEach((img, index) => {
        img.isMain = index === parseInt(mainImageIndex);
      });
    }

    await product.save();

    res.json({
      success: true,
      message: 'Бараа амжилттай шинэчлэгдлээ',
      product
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Бараа олдсонгүй' });
      return;
    }

    res.json({ success: true, message: 'Бараа амжилттай устгалаа' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    let query: any = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const orders = await Order.find(query)
      .populate('user', 'name phoneNumber email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error: any) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: error.message || 'Захиалгууд авахад алдаа гарлаа' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Буруу төлөв' });
      return;
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Захиалга олдсонгүй' });
      return;
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Захиалгын төлөв амжилттай шинэчлэгдлээ',
      order
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
