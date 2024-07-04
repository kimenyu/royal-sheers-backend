"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const cloudinaryConfig_1 = __importDefault(require("../../config/cloudinaryConfig"));
// Configure Cloudinary storage
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinaryConfig_1.default,
    params: {
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});
// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error('Unsupported file format'), false);
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    },
    fileFilter: fileFilter
});
exports.default = upload;
//# sourceMappingURL=multerConfig.js.map