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
exports.loginAdmin = exports.registerAdmin = void 0;
const admin_1 = __importDefault(require("../../models/admin"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
const JWT_EXPIRATION_TIME = '300d';
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, phone, password } = req.body;
    try {
        if (!username || !phone || !email || !password) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        // Check if email or phone number already exists
        const existingEmail = yield admin_1.default.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email is already in use' });
        }
        const existingPhone = yield admin_1.default.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ error: 'Phone number is already in use' });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create admin
        const newAdmin = new admin_1.default({
            username,
            email,
            phone,
            password: hashedPassword,
        });
        const result = yield newAdmin.save();
        return res.status(201).json({
            message: 'Admin created successfully',
            admin: result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
exports.registerAdmin = registerAdmin;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find the Admin by email
        const admin = yield admin_1.default.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        // Compare passwords
        const isMatch = yield bcrypt_1.default.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ adminId: admin._id, adminEmail: admin.email, role: admin.role }, jwtSecret, { expiresIn: JWT_EXPIRATION_TIME });
        return res.status(200).json({ token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.loginAdmin = loginAdmin;
//# sourceMappingURL=adminAccountsController.js.map