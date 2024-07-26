import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin';

interface DecodedToken {
  id: string;
  role: string;
}

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    // Check if the user is an admin
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Attach the admin to the request object
    (req as any).admin = admin;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};