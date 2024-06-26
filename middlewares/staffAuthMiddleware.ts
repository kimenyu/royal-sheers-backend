import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Staff from '../models/staffModel';

interface AuthRequest extends Request {
  user?: any;
  header?: any;
}

const staffAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ error: 'Please authenticate' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const staff = await Staff.findOne({ _id: (decoded as any)._id, 'tokens.token': token });

    if (!staff) {
      throw new Error();
    }

    req.user = staff;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

export default staffAuthMiddleware;
