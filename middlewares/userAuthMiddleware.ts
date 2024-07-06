import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel'; // Adjust the import path according to your project structure

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

interface DecodedToken {
  userId: string;
  userEmail: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: DecodedToken;
}

export const userAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'customer') {
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
