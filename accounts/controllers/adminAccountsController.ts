import { Request, Response } from 'express';
import Admin from '../../models/admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;
const JWT_EXPIRATION_TIME = '300d';

export const registerAdmin = async (req: Request, res: Response) => {
  const { username, email, phone, password } = req.body;

  try {
    if (!username || !phone || !email || !password) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Check if email or phone number already exists
    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const existingPhone = await Admin.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ error: 'Phone number is already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = new Admin({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    const result = await newAdmin.save();

    return res.status(201).json({
      message: 'Admin created successfully',
      admin: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the Admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, adminEmail: admin.email, role: admin.role },
      jwtSecret,
      { expiresIn: JWT_EXPIRATION_TIME }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
