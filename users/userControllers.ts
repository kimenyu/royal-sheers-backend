import { Request, Response } from 'express';
import UserProfile from '../models/userProfile';
import { AuthRequest } from '../middlewares/userAuthMiddleware';

export const createUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const profilePicture = req.file ? req.file.path : '';


    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      bio,
      address,
      socialLinks
    } = req.body;

    // Check if a profile already exists for the user
    const existingProfile = await UserProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const newUserProfile = new UserProfile({
      user: userId,
      bio,
      profilePicture,
      address,
      socialLinks
    });

    const savedProfile = await newUserProfile.save();
    return res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Error creating user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const getUserProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
  
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const userProfile = await UserProfile.findOne({ user: userId });
  
      if (!userProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      return res.status(200).json(userProfile);
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};



export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const profilePicture = req.file ? req.file.path : '';

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      bio,
      address,
      socialLinks
    } = req.body;

    const updatedData: any = {
      bio,
      address,
      socialLinks
    };

    // Only add profilePicture if it was provided
    if (profilePicture) {
      updatedData.profilePicture = profilePicture;
    }

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { user: userId },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
