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
exports.adminAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const admin_1 = __importDefault(require("../models/admin")); // Adjust the import path as needed
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
const adminAuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized - Token missing' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        console.log('Decoded Token:', decoded); // For debugging purposes
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden - Only admins are allowed' });
        }
        const admin = yield admin_1.default.findById(decoded.userId);
        if (!admin) {
            return res.status(401).json({ error: 'Unauthorized - Admin not found' });
        }
        // Add decoded token to req.admin
        req.admin = {
            _id: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error('JWT Error details:', error.message);
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.adminAuthMiddleware = adminAuthMiddleware;
//# sourceMappingURL=adminMiddleware.js.map