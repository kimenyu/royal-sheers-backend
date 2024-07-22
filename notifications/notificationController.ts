import { Request, Response } from 'express';
import Notification from '../models/notificationModel';
import { AuthRequest } from '../middlewares/userAuthMiddleware';

export const createNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { message, type } = req.body;
    const notification = new Notification({
      user: req.user?.userId,
      message,
      type
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ user: req.user?.userId }).sort('-createdAt');
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const markNotificationAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.user?.userId },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};