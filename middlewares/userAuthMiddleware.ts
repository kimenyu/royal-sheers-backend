import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

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

export const userAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    console.log(decoded);

    if (decoded.role !== 'customer') {
      return res.status(403).json({ error: 'Forbidden - Only customers are allowed' });
    }

    // Attach user information to req
    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
