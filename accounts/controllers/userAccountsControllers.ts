import User from '../../models/userModel';
import isValidNumber from '../../utils/number-parser/numParser';
import bcrypt from 'bcrypt';
import emailValidator from 'email-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import generateVerificationCode from '../../utils/verification/verifyAccounts';
import nodemailer from 'nodemailer';
import { Request, Response } from 'express';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;
const JWT_EXPIRATION_TIME = '1d';

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

export const createUser = async (req: Request, res: Response) => {
    const { firstname, lastname, phone, email, password } = req.body;
    try {
        if (!firstname || !lastname || !phone || !email || !password) {
            return res.status(400).json({ error: "missing required parameters" });
        }

        // validate phone and email
        if (!isValidNumber(phone)) {
            return res.status(400).send({ error: "Please use a valid phone number" });
        }

        const existingPhoneNumber = await User.findOne({ phone });

        if (existingPhoneNumber) {
            return res.status(400).send({ error: "Phone number is already in use" });
        }

        if (!emailValidator.validate(email)) {
            return res.status(400).send({ error: "Invalid Email Address" });
        }
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(400).send({ error: "Email is already in use" });
        }

        const verificationCode = generateVerificationCode();

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const newUser = new User({
            firstname,
            lastname,
            phone,
            email,
            password: hashedPassword,
            verificationCode
        });

        const result = await newUser.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL, // Sender address
            to: email, // List of recipients
            subject: 'Code verification', // Subject line
            text: `Hello ${firstname},\n\nYour verification code is: ${verificationCode}.\n\nRegards,\nRoyal Sheers Team` // Plain text body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: "Failed to send verification email" });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(201).json({ message: "Registration successful. Verification code sent to your email." });
            }
        });

        return res.status(201).json({
            msg: "user created successfully",
            user: result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const verifyEmailUser = async (req: Request, res: Response) => {
    const { email, verificationCode } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        // Check if the provided verification code matches the stored one
        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        // Update user verification status
        user.isVerified = true;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Account Verification Successful',
            text: 'Congratulations! Your account has been successfully verified.'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                // Handle email sending error
            } else {
                console.log('Verification email sent: ' + info.response);
                // Handle email sending success
            }
        });

        return res.status(200).json({ message: "Verification successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Find the User by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: 'user is not verified' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: JWT_EXPIRATION_TIME });

        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
