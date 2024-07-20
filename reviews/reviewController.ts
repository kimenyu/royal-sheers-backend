import { Request, Response } from 'express';
import Review from '../models/reviewModel';
import Appointment from '../models/appointmentModel';

interface AuthRequest extends Request {
  params: any;
  body: { appointmentId: any; rating: any; comment: any; };
  user?: any;
}
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    if (!req.user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    if (!appointmentId || !rating) {
      return res.status(400).send({ error: 'Appointment ID and rating are required' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user.userId) {
      return res.status(403).send({ error: 'Forbidden' });
    }

    if (appointment.status !== 'completed') {
      return res.status(400).send({ error: 'Only completed appointments can be reviewed' });
    }

    const review = new Review({
      user: req.user.userId,
      staff: appointment.staff,
      appointment: appointment._id,
      rating,
      comment
    });

    await review.save();
    res.status(201).send(review);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};



export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({});
    res.send(reviews);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getReview = async (req: Request, res: Response) => {
  try {
    const review = await (await Review.findById(req.params.id)).populated('user').populated('staff').populated('appointment');
    if (!review) {
      return res.status(404).send({ error: 'Review not found' });
    }
    res.send(review);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['rating', 'comment'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).send({ error: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Forbidden' });
    }

    updates.forEach(update => (review[update] = req.body[update]));
    await review.save();
    res.send(review);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).send({ error: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Forbidden' });
    }

    res.send(review);
  } catch (error) {
    res.status(500).send(error);
  }
};
