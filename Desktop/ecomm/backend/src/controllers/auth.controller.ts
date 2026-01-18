import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.model.js';

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, email, name, password } = req.body;

    if (!phoneNumber || !email || !name || !password) {
      res.status(400).json({ success: false, message: 'Бүх талбарыг бөглөнө үү' });
      return;
    }

    if (password.length !== 4 || !/^\d{4}$/.test(password)) {
      res.status(400).json({ success: false, message: 'Нууц үг 4 оронтой тоо байх ёстой' });
      return;
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ phoneNumber }, { email }]
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: 'Хэрэглэгч аль хэдийн бүртгэгдсэн байна' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const isFirstAdmin = email === 'n.munkhpurev@gmail.com';
    const user = new User({
      clerkId: `user-${Date.now()}-${Math.random()}`, // Temporary ID
      phoneNumber,
      email,
      name,
      password: hashedPassword,
      role: isFirstAdmin ? 'admin' : 'user'
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Бүртгэл амжилттай',
      token: user._id.toString(), // Return user ID as token
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
    console.error('Sign up error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Бүртгэл үүсгэхэд алдаа гарлаа'
    });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      res.status(400).json({ success: false, message: 'Утасны дугаар болон нууц үг оруулна уу' });
      return;
    }

    // Find user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      res.status(401).json({ success: false, message: 'Утасны дугаар эсвэл нууц үг буруу байна' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: 'Утасны дугаар эсвэл нууц үг буруу байна' });
      return;
    }

    res.json({
      success: true,
      message: 'Нэвтрэх амжилттай',
      token: user._id.toString(), // Using user ID as token
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
    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Нэвтрэхэд алдаа гарлаа'
    });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({ success: false, message: 'Имэйл болон баталгаажуулах код оруулна уу' });
      return;
    }

    // Email verification logic can be added here
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Имэйл амжилттай баталгаажлаа'
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Имэйл баталгаажуулахад алдаа гарлаа'
    });
  }
};
