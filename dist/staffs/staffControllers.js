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
exports.getStaffProfileById = exports.getAllStaffMembers = exports.getStaffProfile = exports.createStaffProfile = void 0;
const staffProfile_1 = __importDefault(require("../models/staffProfile"));
const createStaffProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const staff = req.staff;
    try {
        const { bio, socialMediaLinks } = req.body;
        const profilePicture = req.file ? req.file.path : '';
        // Create a new StaffProfile instance
        const newStaffProfile = new staffProfile_1.default({
            staff: staff._id,
            profilePicture,
            bio,
            socialMediaLinks
        });
        // Save the new profile to the database
        const savedProfile = yield newStaffProfile.save();
        // Respond with the saved profile
        return res.status(201).json(savedProfile);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createStaffProfile = createStaffProfile;
const getStaffProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const staff = req.staff;
    try {
        // Find the staff profile associated with the staff member
        const staffProfile = (yield staffProfile_1.default.findOne({ staff: staff._id }));
        if (!staffProfile) {
            return res.status(404).json({ error: 'Staff profile not found' });
        }
        res.json(staffProfile);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getStaffProfile = getStaffProfile;
const getAllStaffMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffMembers = yield staffProfile_1.default.find();
        res.json(staffMembers);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getAllStaffMembers = getAllStaffMembers;
// Controller to get staff profile by staff ID
const getStaffProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { staffId } = req.params;
        // Validate the staff ID
        if (!staffId) {
            return res.status(400).json({ error: 'Staff ID is required' });
        }
        // Fetch the staff profile from the database
        const staffProfile = yield staffProfile_1.default.findOne({ staff: staffId });
        // Check if the profile exists
        if (!staffProfile) {
            return res.status(404).json({ error: 'Staff profile not found' });
        }
        // Return the staff profile
        res.status(200).json(staffProfile);
    }
    catch (error) {
        console.error('Error fetching staff profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getStaffProfileById = getStaffProfileById;
//# sourceMappingURL=staffControllers.js.map