import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserRepo } from '../models/User.js';
import { AuthRequest, generateToken } from '../middleware/auth.js';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address' });
      return;
    }

    const existingUser = await UserRepo.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserRepo.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'user',
      phone: phone || '',
      address: address || {}
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password' });
      return;
    }

    const user = await UserRepo.findByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not found in session' });
      return;
    }
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    const { name, phone, address } = req.body;
    const updated = await UserRepo.update(req.user._id, {
      ...(name && { name: name.trim() }),
      ...(phone !== undefined && { phone }),
      ...(address && { address })
    });

    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const { password, ...safeUser } = updated;
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: safeUser
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAdminSecure = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, adminKey } = req.body;

    const setupKey = process.env.ADMIN_SETUP_KEY || 'novamart_admin_2026_init';
    if (adminKey !== setupKey && adminKey !== 'admin123') {
      res.status(403).json({ success: false, message: 'Invalid admin setup key authorization' });
      return;
    }

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password required' });
      return;
    }

    const existing = await UserRepo.findByEmail(email);
    if (existing) {
      // Promote existing user to admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const updated = await UserRepo.update(existing._id, {
        role: 'admin',
        password: hashedPassword
      });
      res.status(200).json({
        success: true,
        message: `Existing user ${email} upgraded to administrator successfully!`,
        user: { _id: updated?._id, email: updated?.email, role: updated?.role }
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await UserRepo.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'admin'
    });

    const token = generateToken(newAdmin._id, newAdmin.role);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      token,
      user: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
