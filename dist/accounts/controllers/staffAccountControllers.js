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
exports.getStaffPerformanceMetrics = exports.getAllStaff = exports.loginStaff = exports.verifyEmailStaff = exports.createStaff = void 0;
const staffModel_1 = __importDefault(require("../../models/staffModel"));
const reviewModel_1 = __importDefault(require("../../models/reviewModel"));
const numParser_1 = __importDefault(require("../../utils/number-parser/numParser"));
const email_validator_1 = __importDefault(require("email-validator"));
const dotenv_1 = __importDefault(require("dotenv"));
const verifyAccounts_1 = __importDefault(require("../../utils/verification/verifyAccounts"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
const createStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, expertise, email, phone, password } = req.body;
    try {
        if (!name || !email || !phone || !password) {
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
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newStaff = new staffModel_1.default({
            name,
            expertise,
            email,
            phone,
            password: hashedPassword,
            verificationCode,
            isVerified: false,
            availability: [
                { day: 'Monday', startTime: '09:00', endTime: '21:00' },
                { day: 'Tuesday', startTime: '09:00', endTime: '21:00' },
                { day: 'Wednesday', startTime: '09:00', endTime: '21:00' },
                { day: 'Thursday', startTime: '09:00', endTime: '21:00' },
                { day: 'Friday', startTime: '09:00', endTime: '21:00' },
                { day: 'Saturday', startTime: '09:00', endTime: '21:00' },
                { day: 'Sunday', startTime: '09:00', endTime: '21:00' }
            ],
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
                // It's incorrect to send a response here. The response has already been sent after saving the staff.
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
        const token = jsonwebtoken_1.default.sign({ userId: staff._id, userEmail: staff.email, role: staff.role }, jwtSecret, { expiresIn: JWT_EXPIRATION_TIME });
        return res.status(200).json({ token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.loginStaff = loginStaff;
const getAllStaff = (req, res) => {
    staffModel_1.default.find()
        .then((staff) => {
        res.status(200).json(staff);
    })
        .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    });
};
exports.getAllStaff = getAllStaff;
const getStaffPerformanceMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { staffId } = req.params;
        // Validate staff ID
        if (!staffId) {
            return res.status(400).send({ error: 'Staff ID is required' });
        }
        // Find the staff member
        const staff = yield staffModel_1.default.findById(staffId);
        if (!staff) {
            return res.status(404).send({ error: 'Staff member not found' });
        }
        // Calculate performance metrics
        const reviews = yield reviewModel_1.default.find({ staff: staffId });
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;
        // Update staff performance metrics
        staff.performanceMetrics.ratings = averageRating;
        staff.performanceMetrics.reviewsCount = totalReviews;
        // Save updated staff
        yield staff.save();
        res.status(200).send({
            staffId: staff._id,
            averageRating: staff.performanceMetrics.ratings,
            reviewsCount: staff.performanceMetrics.reviewsCount
        });
    }
    catch (error) {
        console.error('Error fetching staff performance metrics:', error);
        res.status(500).send({ error: 'An error occurred while fetching performance metrics' });
    }
});
exports.getStaffPerformanceMetrics = getStaffPerformanceMetrics;
//# sourceMappingURL=staffAccountControllers.js.map