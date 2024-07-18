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

export interface StaffRequest extends Request {
  staff: {
    _id: string;
    role: string;
  };
}

export const staffAuthMiddleware = (req: StaffRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    console.log('Decoded Token:', decoded); // For debugging purposes
    
    if (decoded.role !== 'staff') {
      return res.status(403).json({ error: 'Forbidden - Only staff are allowed' });
    }

    // Add decoded token to req.staff
    req.staff = {
      _id: decoded.userId,  // Assuming userId is used as staff ID
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
