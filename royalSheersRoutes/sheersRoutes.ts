import express from 'express';
import { staffAuthMiddleware } from '../middlewares/staffAuthMiddleware';
import { userAuthMiddleware } from '../middlewares/userAuthMiddleware';
import {
  createAppointment, getAppointments, cancelAppointment, createAppointmentWithoutStaff
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
  createStaff, verifyEmailStaff, loginStaff
} from '../accounts/controllers/staffAccountControllers';
import { createStaffProfile, getStaffProfile } from '../staffs/staffControllers';

import upload from '../utils/imagesupload/multerConfig';
const router = express.Router();

// User Routes

router.post('/create/user', createUser);
router.post('/verify/user/email', verifyEmailUser);
router.post('/user/login', loginUser);


//staff routes

router.post('/create/staff', createStaff);
router.post('/verify/staff/email', verifyEmailStaff);
router.post('/staff/login', loginStaff);


// Appointment Routes
router.post('/create/appointments', userAuthMiddleware, createAppointment);
router.get('/list/appointments', userAuthMiddleware, getAppointments);
router.delete('/cancel/appointments/:id', userAuthMiddleware, cancelAppointment);
router.post('/create/appointments/withoutstaff', userAuthMiddleware, createAppointmentWithoutStaff);

// Service Routes
router.post('/create/services', staffAuthMiddleware,  upload.single('image'), createService);
router.get('/services', getServices);
router.get('/services/:id',  getService);
router.patch('/services/:id', staffAuthMiddleware, upload.single('image'),updateService);
router.delete('/services/delete/:id', staffAuthMiddleware, deleteService);

// Review Routes
router.post('/reviews', userAuthMiddleware, createReview);
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

router.post('/staff/profile', staffAuthMiddleware,  upload.single('profilePicture'), createStaffProfile);
router.get('/staff/profile/:id', staffAuthMiddleware, getStaffProfile);

export default router;
