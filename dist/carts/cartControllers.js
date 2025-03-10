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
exports.removeFromCart = exports.getCart = exports.addToCart = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const myredis_1 = require("../utils/redisclient/myredis");
// Helper function to get cart from cache or database
function getCartFromCacheOrDB(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheKey = `cart:${userId}`;
        const cachedCart = yield myredis_1.client.get(cacheKey);
        if (cachedCart) {
            return JSON.parse(cachedCart);
        }
        const cart = yield cartModel_1.default.findOne({ user: userId }).populate('items.product');
        if (cart) {
            yield myredis_1.client.setEx(cacheKey, 3600, JSON.stringify(cart)); // Cache for 1 hour
        }
        return cart;
    });
}
// Helper function to update cart in cache
function updateCartCache(userId, cart) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheKey = `cart:${userId}`;
        yield myredis_1.client.setEx(cacheKey, 3600, JSON.stringify(cart));
    });
}
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId, quantity } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const product = yield productModel_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock' });
        }
        let cart = yield getCartFromCacheOrDB(userId);
        if (cart) {
            const cartItemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);
            if (cartItemIndex > -1) {
                // Item exists, update quantity
                cart.items[cartItemIndex].quantity += quantity;
            }
            else {
                // Add new item
                const newItem = { product: product, quantity };
                cart.items.push(newItem);
            }
            cart.totalPrice += product.price * quantity;
        }
        else {
            // Create a new cart
            cart = new cartModel_1.default({
                user: userId,
                items: [{ product: product, quantity }],
                totalPrice: product.price * quantity
            });
        }
        yield cart.save();
        yield updateCartCache(userId, cart);
        res.status(200).json(cart);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.addToCart = addToCart;
// Get Cart
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const cart = yield getCartFromCacheOrDB(userId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getCart = getCart;
// Remove from Cart
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId, quantity } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        let cart = yield getCartFromCacheOrDB(userId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const cartItemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        const product = cart.items[cartItemIndex].product;
        if (quantity && cart.items[cartItemIndex].quantity > quantity) {
            // Reduce quantity
            cart.items[cartItemIndex].quantity -= quantity;
            cart.totalPrice -= quantity * product.price;
        }
        else {
            // Remove entire item
            cart.totalPrice -= cart.items[cartItemIndex].quantity * product.price;
            cart.items.splice(cartItemIndex, 1);
        }
        yield cart.save();
        yield updateCartCache(userId, cart);
        res.status(200).json(cart);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.removeFromCart = removeFromCart;
//# sourceMappingURL=cartControllers.js.map