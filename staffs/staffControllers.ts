import { Request, Response } from 'express';
import StaffProfile from '../models/staffProfile';
import Staff from '../models/staffModel';

export const createStaffProfile = async (req: Request & { staff: any }, res: Response) => {
    const staff = req.staff;

    try {
        const { bio, socialMediaLinks } = req.body;
        const profilePicture = req.file ? req.file.path : '';

        // Create a new StaffProfile instance
        const newStaffProfile = new StaffProfile({
            staff: staff._id,
            profilePicture,
            bio,
            socialMediaLinks
        });

        // Save the new profile to the database
        const savedProfile = await newStaffProfile.save();

        // Respond with the saved profile
        return res.status(201).json(savedProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getStaffProfile = async (req: Request & { staff: any }, res: Response) => {
    const staff = req.staff;

    try {
        // Find the staff profile associated with the staff member
        const staffProfile = (await StaffProfile.findOne({ staff: staff._id }));
        if (!staffProfile) {
            return res.status(404).json({ error: 'Staff profile not found' });
        }
        res.json(staffProfile);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getAllStaffMembers = async (req: Request, res: Response) => {
    try {
        const staffMembers = await StaffProfile.find();
        res.json(staffMembers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}