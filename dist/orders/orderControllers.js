"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.cancelOrder = exports.updateOrderStatus = exports.getOrderById = exports.getOrders = exports.createOrder = void 0;
const orderModel_1 = __importStar(require("../models/orderModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const myredis_1 = require("../utils/redisclient/myredis");
// Helper function to create a notification
const createNotification = (userId, message, type) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = new notificationModel_1.default({
        user: userId,
        message,
        type
    });
    yield notification.save();
});
// Helper function to get order from cache or database
function getOrderFromCacheOrDB(orderId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheKey = `order:${orderId}:${userId}`;
        const cachedOrder = yield myredis_1.client.get(cacheKey);
        if (cachedOrder) {
            return JSON.parse(cachedOrder);
        }
        const order = yield orderModel_1.default.findOne({ _id: orderId, user: userId }).populate('items.product');
        if (order) {
            yield myredis_1.client.setEx(cacheKey, 3600, JSON.stringify(order)); // Cache for 1 hour
        }
        return order;
    });
}
// Helper function to update order cache
function updateOrderCache(orderId, userId, order) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheKey = `order:${orderId}:${userId}`;
        yield myredis_1.client.setEx(cacheKey, 3600, JSON.stringify(order));
    });
}
// Helper function to invalidate user's orders cache
function invalidateUserOrdersCache(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheKey = `orders:${userId}`;
        yield myredis_1.client.del(cacheKey);
    });
}
// Create Order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const cart = yield cartModel_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        const populatedCart = cart;
        const orderItems = populatedCart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));
        const order = new orderModel_1.default({
            user: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId,
            items: orderItems,
            totalPrice: cart.totalPrice,
            status: orderModel_1.OrderStatus.PENDING
        });
        yield order.save();
        yield cartModel_1.default.deleteOne({ _id: cart._id });
        // Invalidate user's orders cache
        yield invalidateUserOrdersCache((_c = req.user) === null || _c === void 0 ? void 0 : _c.userId);
        // Create a notification for the new order
        yield createNotification((_d = req.user) === null || _d === void 0 ? void 0 : _d.userId, `New order created with ID: ${order._id}`, 'success');
        res.status(201).json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createOrder = createOrder;
// Get all orders for a user
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const cacheKey = `orders:${userId}`;
        const cachedOrders = yield myredis_1.client.get(cacheKey);
        if (cachedOrders) {
            return res.status(200).json(JSON.parse(cachedOrders));
        }
        const orders = yield orderModel_1.default.find({ user: userId })
            .populate('items.product')
            .sort({ createdAt: -1 });
        yield myredis_1.client.setEx(cacheKey, 3600, JSON.stringify(orders)); // Cache for 1 hour
        res.status(200).json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getOrders = getOrders;
// Get a specific order by ID
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const orderId = req.params.orderId;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const order = yield getOrderFromCacheOrDB(orderId, userId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getOrderById = getOrderById;
// Update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const orderId = req.params.orderId;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { status } = req.body;
        if (!Object.values(orderModel_1.OrderStatus).includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }
        const order = yield orderModel_1.default.findOneAndUpdate({ _id: orderId, user: userId }, { status: status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Update order cache
        yield updateOrderCache(orderId, userId, order);
        // Invalidate user's orders cache
        yield invalidateUserOrdersCache(userId);
        // Create a notification for the status update
        yield createNotification(userId, `Order ${orderId} status updated to ${status}`, 'info');
        res.status(200).json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// Cancel order
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const orderId = req.params.orderId;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const order = yield orderModel_1.default.findOneAndUpdate({ _id: orderId, user: userId, status: orderModel_1.OrderStatus.PENDING }, { status: orderModel_1.OrderStatus.CANCELLED }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
        }
        // Update order cache
        yield updateOrderCache(orderId, userId, order);
        // Invalidate user's orders cache
        yield invalidateUserOrdersCache(userId);
        // Create a notification for the cancelled order
        yield createNotification(userId, `Order ${orderId} has been cancelled`, 'warning');
        res.status(200).json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.cancelOrder = cancelOrder;
//# sourceMappingURL=orderControllers.js.map