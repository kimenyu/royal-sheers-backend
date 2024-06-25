import Staff from '../../models/staffModel';
import isValidNumber from '../../utils/number-parser/numParser';
import emailValidator from 'email-validator';
import dotenv from 'dotenv';
import generateVerificationCode from '../../utils/verification/verifyAccounts';
import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET as string;
const JWT_EXPIRATION_TIME = '1d';


dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const createStaff = async (req: Request, res: Response) => {
  const { name, role, expertise, email, phone, password } = req.body;
  try {
    if (!name || !role || !email || !phone || !password) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    if (!isValidNumber(phone)) {
      return res.status(400).send({ error: "Please use a valid phone number" });
    }

    if (!emailValidator.validate(email)) {
      return res.status(400).send({ error: "Invalid Email Address" });
    }

    const existingEmail = await Staff.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({ error: "Email is already in use" });
    }

    const verificationCode = generateVerificationCode();

    const newStaff = new Staff({
      name,
      role,
      expertise,
      email,
      phone,
      password,
      verificationCode,
      isVerified: false,
      availability: [],
      performanceMetrics: {
        ratings: 0,
        reviewsCount: 0
      }
    });

    const result = await newStaff.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Staff Account Verification',
      text: `Hello ${name},\n\nYour verification code is: ${verificationCode}.\n\nRegards,\nRoyal Sheers Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to send verification email" });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(201).json({ message: "Staff created successfully. Verification code sent to email." });
      }
    });

    return res.status(201).json({
      msg: "Staff created successfully",
      staff: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};




export const verifyEmailStaff = async (req: Request, res: Response) => {
  const { email, verificationCode } = req.body;

  try {
    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (staff.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    staff.isVerified = true;
    await staff.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Account Verification Successful',
      text: 'Congratulations! Your account has been successfully verified.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Verification email sent: ' + info.response);
      }
    });

    return res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginStaff = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const isMatch = await bcrypt.compare(password, staff.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!staff.isVerified) {
      return res.status(400).json({ message: 'Staff is not verified' });
    }

    const token = jwt.sign({ id: staff._id }, jwtSecret, { expiresIn: JWT_EXPIRATION_TIME });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
