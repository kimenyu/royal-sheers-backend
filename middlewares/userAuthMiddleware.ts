import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

interface AuthRequest extends Request {
  user?: any;
  header?: any;
}

const userAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ error: 'Please authenticate' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findOne({ _id: (decoded as any)._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

export default userAuthMiddleware;
