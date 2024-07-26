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
exports.adminMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_1 = __importDefault(require("../models/admin"));
const adminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'Authentication required' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        const admin = yield admin_1.default.findById(decoded.id);
        console.log('Found admin:', admin);
        if (!admin) {
            console.log('No admin found with id:', decoded.id);
            return res.status(403).json({ message: 'Admin access required' });
        }
        if (admin.role !== 'admin') {
            console.log('User role is not admin:', admin.role);
            return res.status(403).json({ message: 'Admin access required' });
        }
        req.admin = admin;
        next();
    }
    catch (error) {
        console.error('Error in admin middleware:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=adminMiddleware.js.map