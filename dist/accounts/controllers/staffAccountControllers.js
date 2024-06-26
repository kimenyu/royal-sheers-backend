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
exports.loginStaff = exports.verifyEmailStaff = exports.createStaff = void 0;
const staffModel_1 = __importDefault(require("../../models/staffModel"));
const numParser_1 = __importDefault(require("../../utils/number-parser/numParser"));
const email_validator_1 = __importDefault(require("email-validator"));
const dotenv_1 = __importDefault(require("dotenv"));
const verifyAccounts_1 = __importDefault(require("../../utils/verification/verifyAccounts"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET;
const JWT_EXPIRATION_TIME = '1d';
dotenv_1.default.config();
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
const createStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, role, expertise, email, phone, password } = req.body;
    try {
        if (!name || !role || !email || !phone || !password) {
            return res.status(400).json({ error: "Missing required parameters" });
        }
        if (!(0, numParser_1.default)(phone)) {
            return res.status(400).send({ error: "Please use a valid phone number" });
        }
        if (!email_validator_1.default.validate(email)) {
            return res.status(400).send({ error: "Invalid Email Address" });
        }
        const existingEmail = yield staffModel_1.default.findOne({ email });
        if (existingEmail) {
            return res.status(400).send({ error: "Email is already in use" });
        }
        const verificationCode = (0, verifyAccounts_1.default)();
        const newStaff = new staffModel_1.default({
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
        const result = yield newStaff.save();
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
            }
            else {
                console.log('Email sent: ' + info.response);
                return res.status(201).json({ message: "Staff created successfully. Verification code sent to email." });
            }
        });
        return res.status(201).json({
            msg: "Staff created successfully",
            staff: result,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});
exports.createStaff = createStaff;
const verifyEmailStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, verificationCode } = req.body;
    try {
        const staff = yield staffModel_1.default.findOne({ email });
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }
        if (staff.verificationCode !== verificationCode) {
            return res.status(400).json({ message: "Invalid verification code" });
        }
        staff.isVerified = true;
        yield staff.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Account Verification Successful',
            text: 'Congratulations! Your account has been successfully verified.'
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            }
            else {
                console.log('Verification email sent: ' + info.response);
            }
        });
        return res.status(200).json({ message: "Verification successful" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.verifyEmailStaff = verifyEmailStaff;
const loginStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const staff = yield staffModel_1.default.findOne({ email });
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }
        const isMatch = yield bcrypt_1.default.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!staff.isVerified) {
            return res.status(400).json({ message: 'Staff is not verified' });
        }
        const token = jsonwebtoken_1.default.sign({ id: staff._id }, jwtSecret, { expiresIn: JWT_EXPIRATION_TIME });
        return res.status(200).json({ token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.loginStaff = loginStaff;
//# sourceMappingURL=staffAccountControllers.js.map