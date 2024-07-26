"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const staffAuthMiddleware_1 = require("../middlewares/staffAuthMiddleware");
const userAuthMiddleware_1 = require("../middlewares/userAuthMiddleware");
const adminAccountsController_1 = require("../accounts/controllers/adminAccountsController");
const appointmentController_1 = require("../appointments/appointmentController");
const royalSheerServicesControllers_1 = require("../royalsheerservices/royalSheerServicesControllers");
const reviewController_1 = require("../reviews/reviewController");
const loyaltyControllers_1 = require("../loyalty/loyaltyControllers");
const memberContollers_1 = require("../members/memberContollers");
const giftControllers_1 = require("../giftcards/giftControllers");
const userAccountsControllers_1 = require("../accounts/controllers/userAccountsControllers");
const staffAccountControllers_1 = require("../accounts/controllers/staffAccountControllers");
const staffControllers_1 = require("../staffs/staffControllers");
const userControllers_1 = require("../users/userControllers");
const multerConfig_1 = __importDefault(require("../utils/imagesupload/multerConfig"));
const productController_1 = require("../products/productController");
const orderControllers_1 = require("../orders/orderControllers");
const cartControllers_1 = require("../carts/cartControllers");
const notificationController_1 = require("../notifications/notificationController");
const router = express_1.default.Router();
//admin routes
router.post('/create/admin', adminAccountsController_1.registerAdmin);
router.post('/login/admin', adminAccountsController_1.loginAdmin);
// User Routes
router.post('/create/user', userAccountsControllers_1.createUser);
router.post('/verify/user/email', userAccountsControllers_1.verifyEmailUser);
router.post('/user/login', userAccountsControllers_1.loginUser);
//staff routes
router.post('/create/staff', staffAccountControllers_1.createStaff);
router.post('/verify/staff/email', staffAccountControllers_1.verifyEmailStaff);
router.post('/staff/login', staffAccountControllers_1.loginStaff);
router.get('/staffs', staffAccountControllers_1.getAllStaff);
router.get('/staff/:staffId/performance', staffAccountControllers_1.getStaffPerformanceMetrics);
// Appointment Routes
router.post('/create/appointments', userAuthMiddleware_1.userAuthMiddleware, appointmentController_1.createAppointment);
router.get('/list/appointments', userAuthMiddleware_1.userAuthMiddleware, appointmentController_1.getAppointments);
router.get('/appointments/:id', userAuthMiddleware_1.userAuthMiddleware, appointmentController_1.getAppointmentById);
router.delete('/cancel/appointments/:id', userAuthMiddleware_1.userAuthMiddleware, appointmentController_1.cancelAppointment);
router.post('/create/appointments/withoutstaff', userAuthMiddleware_1.userAuthMiddleware, appointmentController_1.createAppointmentWithoutStaff);
router.post('/appointments/:id/complete', userAuthMiddleware_1.userAuthMiddleware, appointmentController_1.completeAppointment);
router.delete('/delete/appointments/:id', userAuthMiddleware_1.userAuthMiddleware, appointmentController_1.deleteAppointment);
// Service Routes
router.post('/create/services', staffAuthMiddleware_1.staffAuthMiddleware, multerConfig_1.default.single('image'), royalSheerServicesControllers_1.createService);
router.get('/services', royalSheerServicesControllers_1.getServices);
router.get('/services/:id', royalSheerServicesControllers_1.getService);
router.patch('/services/:id', staffAuthMiddleware_1.staffAuthMiddleware, multerConfig_1.default.single('image'), royalSheerServicesControllers_1.updateService);
router.delete('/services/delete/:id', staffAuthMiddleware_1.staffAuthMiddleware, royalSheerServicesControllers_1.deleteService);
// User Profile Routes
router.post('/user/profile', userAuthMiddleware_1.userAuthMiddleware, multerConfig_1.default.single('profilePicture'), userControllers_1.createUserProfile);
router.get('/user/profile/:id', userAuthMiddleware_1.userAuthMiddleware, userControllers_1.getUserProfile);
router.patch('/user/profile/:id', userAuthMiddleware_1.userAuthMiddleware, multerConfig_1.default.single('profilePicture'), userControllers_1.updateUserProfile);
// Review Routes
router.post('/create/reviews', userAuthMiddleware_1.userAuthMiddleware, reviewController_1.createReview);
router.get('/reviews', reviewController_1.getReviews);
router.get('/reviews/:id', reviewController_1.getReview);
router.patch('/reviews/:id', userAuthMiddleware_1.userAuthMiddleware, reviewController_1.updateReview);
router.delete('/reviews/:id', userAuthMiddleware_1.userAuthMiddleware, reviewController_1.deleteReview);
// Loyalty Program Routes
router.get('/loyalty', userAuthMiddleware_1.userAuthMiddleware, loyaltyControllers_1.getLoyaltyProgram);
router.post('/loyalty/points', userAuthMiddleware_1.userAuthMiddleware, loyaltyControllers_1.addLoyaltyPoints);
router.post('/loyalty/redeem', userAuthMiddleware_1.userAuthMiddleware, loyaltyControllers_1.redeemReward);
// Membership Routes
router.post('/memberships', memberContollers_1.createMembership);
router.get('/memberships', memberContollers_1.getMemberships);
router.get('/memberships/:id', memberContollers_1.getMembership);
router.patch('/memberships/:id', memberContollers_1.updateMembership);
router.delete('/memberships/:id', memberContollers_1.deleteMembership);
// Gift Card Routes
router.post('/giftcards', giftControllers_1.createGiftCard);
router.get('/giftcards', giftControllers_1.getGiftCards);
router.get('/giftcards/:id', giftControllers_1.getGiftCard);
router.patch('/giftcards/:id', giftControllers_1.updateGiftCard);
router.delete('/giftcards/:id', giftControllers_1.deleteGiftCard);
// Staff Profile Routes
router.post('/staff/create/profile', staffAuthMiddleware_1.staffAuthMiddleware, multerConfig_1.default.single('profilePicture'), staffControllers_1.createStaffProfile);
router.get('/staff/profile/:id', staffControllers_1.getStaffProfile);
router.get('/staff/members', staffControllers_1.getAllStaffMembers);
router.get('/staff/profile/all/:staffId', staffControllers_1.getStaffProfileById);
//products controllers
router.get('/products', productController_1.getAllProducts);
router.get('/products/:id', productController_1.getProductById);
router.post('/create/products', productController_1.createProduct);
router.put('/products/:id', productController_1.updateProduct);
router.delete('/products/:id', productController_1.deleteProduct);
// Order routes
router.post('/create/orders', userAuthMiddleware_1.userAuthMiddleware, orderControllers_1.createOrder);
router.get('/my/orders', userAuthMiddleware_1.userAuthMiddleware, orderControllers_1.getOrders);
router.get('/order/:orderId', userAuthMiddleware_1.userAuthMiddleware, orderControllers_1.getOrderById);
router.patch('/order/:orderId/status', userAuthMiddleware_1.userAuthMiddleware, orderControllers_1.updateOrderStatus);
router.patch('/order/:orderId/cancel', userAuthMiddleware_1.userAuthMiddleware, orderControllers_1.cancelOrder);
//cart routes
router.post('/cart/add', userAuthMiddleware_1.userAuthMiddleware, cartControllers_1.addToCart);
router.get('/my/cart', userAuthMiddleware_1.userAuthMiddleware, cartControllers_1.getCart);
router.post('/mycart/remove', userAuthMiddleware_1.userAuthMiddleware, cartControllers_1.removeFromCart);
//notification routes
router.post('/create/notification', userAuthMiddleware_1.userAuthMiddleware, notificationController_1.createNotification);
router.get('/my/notifications', userAuthMiddleware_1.userAuthMiddleware, notificationController_1.getUserNotifications);
router.patch('/notification/:notificationId/read', userAuthMiddleware_1.userAuthMiddleware, notificationController_1.markNotificationAsRead);
// Error handling middleware
exports.default = router;
//# sourceMappingURL=sheersRoutes.js.map