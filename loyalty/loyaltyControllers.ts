import { Request, Response } from 'express';
import LoyaltyProgram from '../models/loyaltyProgramModel';

interface AuthRequest extends Request {
  body: { reward: any; points: number };
  user?: any;
}

export const getLoyaltyProgram = async (req: AuthRequest, res: Response) => {
  try {
    const loyaltyProgram = await LoyaltyProgram.findOne({ user: req.user._id });
    if (!loyaltyProgram) {
      return res.status(404).send({ error: 'Loyalty Program not found' });
    }
    res.send(loyaltyProgram);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const addLoyaltyPoints = async (req: AuthRequest, res: Response) => {
  try {
    const { points } = req.body;
    const loyaltyProgram = await LoyaltyProgram.findOne({ user: req.user._id });

    if (!loyaltyProgram) {
      const newLoyaltyProgram = new LoyaltyProgram({
        user: req.user._id,
        points,
        rewards: []
      });
      await newLoyaltyProgram.save();
      return res.status(201).send(newLoyaltyProgram);
    }

    loyaltyProgram.points += points;
    await loyaltyProgram.save();
    res.send(loyaltyProgram);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const redeemReward = async (req: AuthRequest, res: Response) => {
  try {
    const { reward } = req.body;
    const loyaltyProgram = await LoyaltyProgram.findOne({ user: req.user._id });

    if (!loyaltyProgram || loyaltyProgram.points < reward.points) {
      return res.status(400).send({ error: 'Not enough points to redeem this reward' });
    }

    loyaltyProgram.points -= reward.points;
    loyaltyProgram.rewards.push(reward);
    await loyaltyProgram.save();
    res.send(loyaltyProgram);
  } catch (error) {
    res.status(500).send(error);
  }
};
