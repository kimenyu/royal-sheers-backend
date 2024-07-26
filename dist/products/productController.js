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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const multerConfig_1 = __importDefault(require("../utils/imagesupload/multerConfig"));
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
exports.createProduct = [
    adminMiddleware_1.adminMiddleware,
    multerConfig_1.default.single('image'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { name, description, price, stock } = req.body;
            const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            const product = new productModel_1.default({
                name,
                description,
                price,
                stock,
                image
            });
            yield product.save();
            res.status(201).json(product);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    })
];
// Get All Products with Search and Pagination
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const query = {
            name: { $regex: search, $options: 'i' }
        };
        const products = yield productModel_1.default.find(query)
            .skip((+page - 1) * +limit)
            .limit(+limit);
        const total = yield productModel_1.default.countDocuments(query);
        res.status(200).json({
            products,
            currentPage: +page,
            totalPages: Math.ceil(total / +limit),
            totalItems: total
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllProducts = getAllProducts;
// Get Product by ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getProductById = getProductById;
// Update Product
exports.updateProduct = [
    multerConfig_1.default.single('image'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { name, description, price, stock } = req.body;
            const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            const product = yield productModel_1.default.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.stock = stock || product.stock;
            product.image = image || product.image;
            yield product.save();
            res.status(200).json(product);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    })
];
// Delete Product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map