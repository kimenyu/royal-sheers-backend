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
exports.updateUserProfile = exports.getUserProfile = exports.createUserProfile = void 0;
const userProfile_1 = __importDefault(require("../models/userProfile"));
const multer_1 = __importDefault(require("multer"));
const createUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const profilePicture = req.file ? req.file.path : '';
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!profilePicture) {
            return res.status(400).json({ message: 'Profile picture is required' });
        }
        const { bio, address, socialLinks } = req.body;
        // Check if a profile already exists for the user
        const existingProfile = yield userProfile_1.default.findOne({ user: userId });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists' });
        }
        const newUserProfile = new userProfile_1.default({
            user: userId,
            bio,
            profilePicture,
            address,
            socialLinks
        });
        const savedProfile = yield newUserProfile.save();
        return res.status(201).json(savedProfile);
    }
    catch (error) {
        console.error('Error creating user profile:', error);
        if (error instanceof multer_1.default.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File is too large. Maximum size is 50MB.' });
            }
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createUserProfile = createUserProfile;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userProfile = yield userProfile_1.default.findOne({ user: userId });
        if (!userProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        return res.status(200).json(userProfile);
    }
    catch (error) {
        console.error('Error retrieving user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getUserProfile = getUserProfile;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const profilePicture = req.file ? req.file.path : '';
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { bio, address, socialLinks } = req.body;
        const updatedData = {
            bio,
            address,
            socialLinks
        };
        // Only add profilePicture if it was provided
        if (profilePicture) {
            updatedData.profilePicture = profilePicture;
        }
        const updatedProfile = yield userProfile_1.default.findOneAndUpdate({ user: userId }, { $set: updatedData }, { new: true, runValidators: true });
        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        return res.status(200).json(updatedProfile);
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=userControllers.js.map