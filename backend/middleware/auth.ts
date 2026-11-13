import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepo } from '../models/User.js';
import { IUser } from '../config/db.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'novamart_jwt_super_secure_secret_token_key_2026';

export const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

      const user = await UserRepo.findById(decoded.id);
      if (!user) {
        res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
        return;
      }

      // Strip password from attached user
      const { password, ...safeUser } = user;
      req.user = safeUser as IUser;
      next();
      return;
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized: invalid or expired token' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized: no token provided' });
    return;
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
  }
};
