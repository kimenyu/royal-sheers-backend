import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admin from '../models/admin';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

interface DecodedToken {
  adminId: string;  // Changed from userId to adminId
  adminEmail: string;  // Changed from userEmail to adminEmail
  role: string;
  iat: number;
  exp: number;
}

export interface AdminRequest extends Request {
  admin?: {
    _id: string;
    role: string;
  };
}

export const adminAuthMiddleware = async (req: AdminRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized - Token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    console.log('Decoded Token:', decoded);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Only admins are allowed' });
    }

    console.log('Searching for admin with ID:', decoded.adminId);
    const admin = await Admin.findById(decoded.adminId);
    console.log('Found admin:', admin);

    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized - Admin not found' });
    }

    req.admin = {
      _id: decoded.adminId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('JWT Error details:', error.message);
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};