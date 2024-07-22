import express from 'express';
import { staffAuthMiddleware } from '../middlewares/staffAuthMiddleware';
import { userAuthMiddleware } from '../middlewares/userAuthMiddleware';
import { adminAuthMiddleware } from '../middlewares/adminMiddleware';

import { registerAdmin, loginAdmin} from '../accounts/controllers/adminAccountsController';
import {
  createAppointment, getAppointments, cancelAppointment, createAppointmentWithoutStaff, getAppointmentById, completeAppointment, deleteAppointment
} from '../appointments/appointmentController';
import {
  createService, getServices, getService, updateService, deleteService
} from '../royalsheerservices/royalSheerServicesControllers';
import {
  createReview, getReviews, getReview, updateReview, deleteReview
} from '../reviews/reviewController';
import {
  getLoyaltyProgram, addLoyaltyPoints, redeemReward
} from '../loyalty/loyaltyControllers';
import {
  createMembership, getMemberships, getMembership, updateMembership, deleteMembership
} from '../members/memberContollers';
import {
  createGiftCard, getGiftCards, getGiftCard, updateGiftCard, deleteGiftCard
} from '../giftcards/giftControllers';
import { 
  createUser, verifyEmailUser, loginUser
} from '../accounts/controllers/userAccountsControllers';

import {
  createStaff, verifyEmailStaff, loginStaff, getAllStaff, getStaffPerformanceMetrics
} from '../accounts/controllers/staffAccountControllers';
import { createStaffProfile, getStaffProfile, getAllStaffMembers, getStaffProfileById } from '../staffs/staffControllers';
import { createUserProfile, getUserProfile, updateUserProfile } from '../users/userControllers';
import upload from '../utils/imagesupload/multerConfig';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../products/productController';
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  cancelOrder 
} from '../orders/orderControllers';
import { addToCart, getCart, removeFromCart } from '../carts/cartControllers';

const router = express.Router();

//admin routes

router.post('/create/admin', registerAdmin);
router.post('/login/admin', loginAdmin);

// User Routes
router.post('/create/user', createUser);
router.post('/verify/user/email', verifyEmailUser);
router.post('/user/login', loginUser);


//staff routes

router.post('/create/staff', createStaff);
router.post('/verify/staff/email', verifyEmailStaff);
router.post('/staff/login', loginStaff);
router.get('/staffs', getAllStaff);
router.get('/staff/:staffId/performance', getStaffPerformanceMetrics);


// Appointment Routes
router.post('/create/appointments', userAuthMiddleware, createAppointment);
router.get('/list/appointments', userAuthMiddleware, getAppointments);
router.get('/appointments/:id', userAuthMiddleware, getAppointmentById);
router.delete('/cancel/appointments/:id', userAuthMiddleware, cancelAppointment);
router.post('/create/appointments/withoutstaff', userAuthMiddleware, createAppointmentWithoutStaff);
router.post('/appointments/:id/complete', userAuthMiddleware, completeAppointment);
router.delete('/delete/appointments/:id', userAuthMiddleware, deleteAppointment);

// Service Routes
router.post('/create/services', staffAuthMiddleware,  upload.single('image'), createService);
router.get('/services', getServices);
router.get('/services/:id',  getService);
router.patch('/services/:id', staffAuthMiddleware, upload.single('image'),updateService);
router.delete('/services/delete/:id', staffAuthMiddleware, deleteService);

// User Profile Routes

router.post('/user/profile', userAuthMiddleware, upload.single('profilePicture'), createUserProfile);
router.get('/user/profile/:id', userAuthMiddleware, getUserProfile);
router.patch('/user/profile/:id', userAuthMiddleware, upload.single('profilePicture'), updateUserProfile);

// Review Routes
router.post('/create/reviews', userAuthMiddleware, createReview);
router.get('/reviews', getReviews);
router.get('/reviews/:id', getReview);
router.patch('/reviews/:id', userAuthMiddleware, updateReview);
router.delete('/reviews/:id', userAuthMiddleware, deleteReview);

// Loyalty Program Routes
router.get('/loyalty', userAuthMiddleware, getLoyaltyProgram);
router.post('/loyalty/points', userAuthMiddleware, addLoyaltyPoints);
router.post('/loyalty/redeem', userAuthMiddleware, redeemReward);

// Membership Routes
router.post('/memberships', createMembership);
router.get('/memberships', getMemberships);
router.get('/memberships/:id', getMembership);
router.patch('/memberships/:id', updateMembership);
router.delete('/memberships/:id', deleteMembership);

// Gift Card Routes
router.post('/giftcards', createGiftCard);
router.get('/giftcards', getGiftCards);
router.get('/giftcards/:id', getGiftCard);
router.patch('/giftcards/:id', updateGiftCard);
router.delete('/giftcards/:id', deleteGiftCard);

// Staff Profile Routes

router.post('/staff/create/profile', staffAuthMiddleware,  upload.single('profilePicture'), createStaffProfile);
router.get('/staff/profile/:id', getStaffProfile);
router.get('/staff/members', getAllStaffMembers);
router.get('/staff/profile/all/:staffId', getStaffProfileById);

//products controllers
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/create/products', adminAuthMiddleware, createProduct);
router.put('/products/:id', adminAuthMiddleware, updateProduct);
router.delete('/products/:id', adminAuthMiddleware, deleteProduct);

// Order routes
router.post('/create/orders', userAuthMiddleware, createOrder);
router.get('/my/orders', userAuthMiddleware, getOrders);
router.get('/order/:orderId', userAuthMiddleware, getOrderById);
router.patch('/order/:orderId/status', userAuthMiddleware, updateOrderStatus);
router.patch('/order/:orderId/cancel', userAuthMiddleware, cancelOrder);

//cart routes
router.post('/cart/add', userAuthMiddleware, addToCart);
router.get('/my/cart', userAuthMiddleware, getCart);
router.post('/mycart/remove', userAuthMiddleware, removeFromCart);

export default router;
