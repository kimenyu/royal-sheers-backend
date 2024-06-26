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
exports.deleteMembership = exports.updateMembership = exports.getMembership = exports.getMemberships = exports.createMembership = void 0;
const membershpModel_1 = __importDefault(require("../models/membershpModel"));
const createMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const membership = new membershpModel_1.default(req.body);
        yield membership.save();
        res.status(201).send(membership);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.createMembership = createMembership;
const getMemberships = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memberships = yield membershpModel_1.default.find({});
        res.send(memberships);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getMemberships = getMemberships;
const getMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const membership = yield membershpModel_1.default.findById(req.params.id);
        if (!membership) {
            return res.status(404).send({ error: 'Membership not found' });
        }
        res.send(membership);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getMembership = getMembership;
const updateMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['type', 'benefits', 'users'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const membership = yield membershpModel_1.default.findById(req.params.id);
        if (!membership) {
            return res.status(404).send({ error: 'Membership not found' });
        }
        updates.forEach(update => (membership[update] = req.body[update]));
        yield membership.save();
        res.send(membership);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.updateMembership = updateMembership;
const deleteMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const membership = yield membershpModel_1.default.findByIdAndDelete(req.params.id);
        if (!membership) {
            return res.status(404).send({ error: 'Membership not found' });
        }
        res.send(membership);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.deleteMembership = deleteMembership;
//# sourceMappingURL=memberContollers.js.map