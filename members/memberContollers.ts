import { Request, Response } from 'express';
import Membership from '../models/membershpModel';

interface AuthRequest extends Request {
  user?: any;
}

export const createMembership = async (req: Request, res: Response) => {
  try {
    const membership = new Membership(req.body);
    await membership.save();
    res.status(201).send(membership);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getMemberships = async (req: Request, res: Response) => {
  try {
    const memberships = await Membership.find({});
    res.send(memberships);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getMembership = async (req: Request, res: Response) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) {
      return res.status(404).send({ error: 'Membership not found' });
    }
    res.send(membership);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateMembership = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['type', 'benefits', 'users'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) {
      return res.status(404).send({ error: 'Membership not found' });
    }

    updates.forEach(update => (membership[update] = req.body[update]));
    await membership.save();
    res.send(membership);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteMembership = async (req: Request, res: Response) => {
  try {
    const membership = await Membership.findByIdAndDelete(req.params.id);
    if (!membership) {
      return res.status(404).send({ error: 'Membership not found' });
    }
    res.send(membership);
  } catch (error) {
    res.status(500).send(error);
  }
};
