import { Request, Response } from 'express';
import GiftCard from '../models/giftCardModel';

interface AuthRequest extends Request {
  user?: any;
}

export const createGiftCard = async (req: Request, res: Response) => {
  try {
    const giftCard = new GiftCard(req.body);
    await giftCard.save();
    res.status(201).send(giftCard);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getGiftCards = async (req: Request, res: Response) => {
  try {
    const giftCards = await GiftCard.find({});
    res.send(giftCards);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getGiftCard = async (req: Request, res: Response) => {
  try {
    const giftCard = await GiftCard.findById(req.params.id);
    if (!giftCard) {
      return res.status(404).send({ error: 'Gift Card not found' });
    }
    res.send(giftCard);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateGiftCard = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['value', 'expiryDate', 'isRedeemed'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const giftCard = await GiftCard.findById(req.params.id);
    if (!giftCard) {
      return res.status(404).send({ error: 'Gift Card not found' });
    }

    updates.forEach(update => (giftCard[update] = req.body[update]));
    await giftCard.save();
    res.send(giftCard);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteGiftCard = async (req: Request, res: Response) => {
  try {
    const giftCard = await GiftCard.findByIdAndDelete(req.params.id);
    if (!giftCard) {
      return res.status(404).send({ error: 'Gift Card not found' });
    }
    res.send(giftCard);
  } catch (error) {
    res.status(500).send(error);
  }
};
