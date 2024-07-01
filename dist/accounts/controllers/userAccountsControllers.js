"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.verifyEmailUser = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const numParser_1 = __importDefault(require("../../utils/number-parser/numParser"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_validator_1 = __importDefault(require("email-validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const verifyAccounts_1 = __importDefault(require("../../utils/verification/verifyAccounts"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
const JWT_EXPIRATION_TIME = '1d';
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, phone, email, password } = req.body;
    try {
        if (!username || !phone || !email || !password) {
            return res.status(400).json({ error: "missing required parameters" });
        }
        // validate phone and email
        if (!(0, numParser_1.default)(phone)) {
            return res.status(400).send({ error: "Please use a valid phone number" });
        }
        const existingPhoneNumber = yield userModel_1.default.findOne({ phone });
        if (existingPhoneNumber) {
            return res.status(400).send({ error: "Phone number is already in use" });
        }
        if (!email_validator_1.default.validate(email)) {
            return res.status(400).send({ error: "Invalid Email Address" });
        }
        const existingEmail = yield userModel_1.default.findOne({ email });
        if (existingEmail) {
            return res.status(400).send({ error: "Email is already in use" });
        }
        const verificationCode = (0, verifyAccounts_1.default)();
        // hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // create user
        const newUser = new userModel_1.default({
            username,
            phone,
            email,
            password: hashedPassword,
            verificationCode
        });
        const result = yield newUser.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL, // Sender address
            to: email, // List of recipients
            subject: 'Code verification', // Subject line
            text: `Hello ${username},\n\nYour verification code is: ${verificationCode}.\n\nRegards,\nRoyal Sheers Team` // Plain text body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: "Failed to send verification email" });
            }
            else {
                console.log('Email sent: ' + info.response);
                return res.status(201).json({ message: "Registration successful. Verification code sent to your email." });
            }
        });
        return res.status(201).json({
            msg: "user created successfully",
            user: result,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});
exports.createUser = createUser;
const verifyEmailUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, verificationCode } = req.body;
    try {
        // Find the user by email
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        // Check if the provided verification code matches the stored one
        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: "Invalid verification code" });
        }
        // Update user verification status
        user.isVerified = true;
        yield user.save();
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
            }
            else {
                console.log('Verification email sent: ' + info.response);
                // Handle email sending success
            }
        });
        return res.status(200).json({ message: "Verification successful" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.verifyEmailUser = verifyEmailUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find the User by email
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Compare passwords
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: 'user is not verified' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, userEmail: user.email, role: user.role }, jwtSecret, { expiresIn: JWT_EXPIRATION_TIME });
        return res.status(200).json({ token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.loginUser = loginUser;
//# sourceMappingURL=userAccountsControllers.js.map