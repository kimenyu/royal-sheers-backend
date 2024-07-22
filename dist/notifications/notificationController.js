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
exports.markNotificationAsRead = exports.getUserNotifications = exports.createNotification = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { message, type } = req.body;
        const notification = new notificationModel_1.default({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
            message,
            type
        });
        yield notification.save();
        res.status(201).json(notification);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createNotification = createNotification;
const getUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const notifications = yield notificationModel_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }).sort('-createdAt');
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getUserNotifications = getUserNotifications;
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { notificationId } = req.params;
        const notification = yield notificationModel_1.default.findOneAndUpdate({ _id: notificationId, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }, { read: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json(notification);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
//# sourceMappingURL=notificationController.js.map