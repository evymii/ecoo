import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model.js';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Нэвтрэх шаардлагатай' });
      return;
    }

    const token = authHeader.substring(7);
    // For now, we'll use a simple token check
    // In production, verify with Clerk or JWT
    const user = await User.findOne({ clerkId: token }).select('-password');
    
    if (!user) {
      // Try to find by _id if token is an ObjectId
      try {
        const userById = await User.findById(token).select('-password');
        if (userById) {
          req.userId = userById._id.toString();
          req.userRole = userById.role;
          req.user = userById;
          next();
          return;
        }
      } catch (e) {
        // Not a valid ObjectId
      }
      res.status(401).json({ success: false, message: 'Хүчинтэй токен биш' });
      return;
    }

    req.userId = user._id.toString();
    req.userRole = user.role;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ success: false, message: 'Нэвтрэхэд алдаа гарлаа' });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userRole || req.userRole !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin access required' });
      return;
    }
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
};
