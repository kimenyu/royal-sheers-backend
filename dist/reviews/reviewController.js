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
exports.deleteReview = exports.updateReview = exports.getReview = exports.getReviews = exports.createReview = void 0;
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const appointmentModel_1 = __importDefault(require("../models/appointmentModel"));
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { appointmentId, rating, comment } = req.body;
        if (!req.user) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const appointment = yield appointmentModel_1.default.findById(appointmentId);
        if (!appointment) {
            return res.status(404).send({ error: 'Appointment not found' });
        }
        if (appointment.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'Forbidden' });
        }
        const review = new reviewModel_1.default({
            user: req.user._id,
            staff: appointment.staff,
            appointment: appointment._id,
            rating,
            comment
        });
        yield review.save();
        res.status(201).send(review);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.createReview = createReview;
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield reviewModel_1.default.find({}).populate('user staff service');
        res.send(reviews);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getReviews = getReviews;
const getReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield reviewModel_1.default.findById(req.params.id).populate('user staff service');
        if (!review) {
            return res.status(404).send({ error: 'Review not found' });
        }
        res.send(review);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getReview = getReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['rating', 'comment'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const review = yield reviewModel_1.default.findById(req.params.id);
        if (!review) {
            return res.status(404).send({ error: 'Review not found' });
        }
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'Forbidden' });
        }
        updates.forEach(update => (review[update] = req.body[update]));
        yield review.save();
        res.send(review);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.updateReview = updateReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield reviewModel_1.default.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).send({ error: 'Review not found' });
        }
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'Forbidden' });
        }
        res.send(review);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.deleteReview = deleteReview;
//# sourceMappingURL=reviewController.js.map