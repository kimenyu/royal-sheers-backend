"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const staffAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // For debugging purposes
        if (decoded.role !== 'staff') {
            return res.status(403).json({ error: 'Forbidden - Only staff are allowed' });
        }
        // Add decoded token to req.staff
        req.staff = {
            _id: decoded.userId, // Assuming userId is used as staff ID
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
exports.staffAuthMiddleware = staffAuthMiddleware;
//# sourceMappingURL=staffAuthMiddleware.js.map