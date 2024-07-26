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
exports.redeemReward = exports.addLoyaltyPoints = exports.getLoyaltyProgram = void 0;
const loyaltyProgramModel_1 = __importDefault(require("../models/loyaltyProgramModel"));
const getLoyaltyProgram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loyaltyProgram = yield loyaltyProgramModel_1.default.findOne({ user: req.user._id });
        if (!loyaltyProgram) {
            return res.status(404).send({ error: 'Loyalty Program not found' });
        }
        res.send(loyaltyProgram);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getLoyaltyProgram = getLoyaltyProgram;
const addLoyaltyPoints = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { points } = req.body;
        const loyaltyProgram = yield loyaltyProgramModel_1.default.findOne({ user: req.user._id });
        if (!loyaltyProgram) {
            const newLoyaltyProgram = new loyaltyProgramModel_1.default({
                user: req.user._id,
                points,
                rewards: []
            });
            yield newLoyaltyProgram.save();
            return res.status(201).send(newLoyaltyProgram);
        }
        loyaltyProgram.points += points;
        yield loyaltyProgram.save();
        res.send(loyaltyProgram);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.addLoyaltyPoints = addLoyaltyPoints;
const redeemReward = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reward } = req.body;
        const loyaltyProgram = yield loyaltyProgramModel_1.default.findOne({ user: req.user._id });
        if (!loyaltyProgram || loyaltyProgram.points < reward.points) {
            return res.status(400).send({ error: 'Not enough points to redeem this reward' });
        }
        loyaltyProgram.points -= reward.points;
        loyaltyProgram.rewards.push(reward);
        yield loyaltyProgram.save();
        res.send(loyaltyProgram);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.redeemReward = redeemReward;
//# sourceMappingURL=loyaltyControllers.js.map