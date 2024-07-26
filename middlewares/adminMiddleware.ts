import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Admin from '../models/admin';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

interface DecodedToken {
  userId: string;
  userEmail: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AdminRequest extends Request {
  user?: DecodedToken;
}

export const adminAuthMiddleware = async (req: AdminRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.log('Token missing');
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token);

  try {
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    console.log('Decoded:', decoded);
    const user = await Admin.findById(decoded.userId);
    console.log('User:', user);

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Access denied, invalid token' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Access denied, invalid token' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};
