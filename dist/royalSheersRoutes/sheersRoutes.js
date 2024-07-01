"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const staffAuthMiddleware_1 = require("../middlewares/staffAuthMiddleware");
const userAuthMiddleware_1 = require("../middlewares/userAuthMiddleware");
const appointmentController_1 = require("../appointments/appointmentController");
const royalSheerServicesControllers_1 = require("../royalsheerservices/royalSheerServicesControllers");
const reviewController_1 = require("../reviews/reviewController");
const loyaltyControllers_1 = require("../loyalty/loyaltyControllers");
const memberContollers_1 = require("../members/memberContollers");
const giftControllers_1 = require("../giftcards/giftControllers");
const userAccountsControllers_1 = require("../accounts/controllers/userAccountsControllers");
const staffAccountControllers_1 = require("../accounts/controllers/staffAccountControllers");
const router = express_1.default.Router();
// User Routes
router.post('/create/user', userAccountsControllers_1.createUser);
router.post('/verify/user/email', userAccountsControllers_1.verifyEmailUser);
router.post('/user/login', userAccountsControllers_1.loginUser);
//staff routes
router.post('/create/staff', staffAccountControllers_1.createStaff);
router.post('/verify/staff/email', staffAccountControllers_1.verifyEmailStaff);
router.post('/staff/login', staffAccountControllers_1.loginStaff);
// Appointment Routes
router.post('/create/appointments', userAuthMiddleware_1.userAuthMiddleware, appointmentController_1.createAppointment);
router.get('/list/appointments', userAuthMiddleware_1.userAuthMiddleware, appointmentController_1.getAppointments);
router.delete('/appointments/:id', userAuthMiddleware_1.userAuthMiddleware, appointmentController_1.cancelAppointment);
// Service Routes
router.post('/create/services', staffAuthMiddleware_1.staffAuthMiddleware, royalSheerServicesControllers_1.createService);
router.get('/services', royalSheerServicesControllers_1.getServices);
router.get('/services/:id', royalSheerServicesControllers_1.getService);
router.patch('/services/:id', staffAuthMiddleware_1.staffAuthMiddleware, royalSheerServicesControllers_1.updateService);
router.delete('/services/:id', staffAuthMiddleware_1.staffAuthMiddleware, royalSheerServicesControllers_1.deleteService);
// Review Routes
router.post('/reviews', userAuthMiddleware_1.userAuthMiddleware, reviewController_1.createReview);
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
exports.default = router;
//# sourceMappingURL=sheersRoutes.js.map