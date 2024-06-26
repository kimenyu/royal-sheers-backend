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
exports.deleteGiftCard = exports.updateGiftCard = exports.getGiftCard = exports.getGiftCards = exports.createGiftCard = void 0;
const giftCardModel_1 = __importDefault(require("../models/giftCardModel"));
const createGiftCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const giftCard = new giftCardModel_1.default(req.body);
        yield giftCard.save();
        res.status(201).send(giftCard);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.createGiftCard = createGiftCard;
const getGiftCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const giftCards = yield giftCardModel_1.default.find({});
        res.send(giftCards);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getGiftCards = getGiftCards;
const getGiftCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const giftCard = yield giftCardModel_1.default.findById(req.params.id);
        if (!giftCard) {
            return res.status(404).send({ error: 'Gift Card not found' });
        }
        res.send(giftCard);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getGiftCard = getGiftCard;
const updateGiftCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['value', 'expiryDate', 'isRedeemed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const giftCard = yield giftCardModel_1.default.findById(req.params.id);
        if (!giftCard) {
            return res.status(404).send({ error: 'Gift Card not found' });
        }
        updates.forEach(update => (giftCard[update] = req.body[update]));
        yield giftCard.save();
        res.send(giftCard);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.updateGiftCard = updateGiftCard;
const deleteGiftCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const giftCard = yield giftCardModel_1.default.findByIdAndDelete(req.params.id);
        if (!giftCard) {
            return res.status(404).send({ error: 'Gift Card not found' });
        }
        res.send(giftCard);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.deleteGiftCard = deleteGiftCard;
//# sourceMappingURL=giftControllers.js.map