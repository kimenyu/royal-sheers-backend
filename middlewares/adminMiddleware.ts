import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin';

interface DecodedToken {
  id: string;
  role: string;
}

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    console.log('Decoded token:', decoded);

    const admin = await Admin.findById(decoded.id);
    console.log('Found admin:', admin);

    if (!admin) {
      console.log('No admin found with id:', decoded.id);
      return res.status(403).json({ message: 'Admin access required' });
    }

    if (admin.role !== 'admin') {
      console.log('User role is not admin:', admin.role);
      return res.status(403).json({ message: 'Admin access required' });
    }

    (req as any).admin = admin;
    next();
  } catch (error) {
    console.error('Error in admin middleware:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};