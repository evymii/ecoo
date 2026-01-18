import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import Order from '../models/Order.model.js';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, message: 'Нэвтрэх шаардлагатай' });
      return;
    }

    const { items, deliveryAddress, paymentMethod } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'Хэрэглэгч олдсонгүй' });
      return;
    }

    if (!items || items.length === 0) {
      res.status(400).json({ success: false, message: 'Сагс хоосон байна' });
      return;
    }

    if (!deliveryAddress || !deliveryAddress.address) {
      res.status(400).json({ success: false, message: 'Хүргэлтийн хаяг оруулна уу' });
      return;
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(404).json({ success: false, message: `Бараа олдсонгүй: ${item.productId}` });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({ success: false, message: `${product.name} барааны нөөц хүрэлцэхгүй байна` });
        return;
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Generate order code
    const orderCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      user: user._id,
      items: orderItems,
      total,
      deliveryAddress,
      paymentMethod: paymentMethod || 'pay_later',
      orderCode,
      status: 'pending'
    });

    const savedOrder = await order.save();
    
    // Populate the order before sending response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('user', 'name phoneNumber email')
      .populate('items.product');

    res.status(201).json({
      success: true,
      message: 'Захиалга амжилттай үүслээ',
      order: populatedOrder
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Захиалга үүсгэхэд алдаа гарлаа' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user');

    if (!order) {
      res.status(404).json({ success: false, message: 'Захиалга олдсонгүй' });
      return;
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
