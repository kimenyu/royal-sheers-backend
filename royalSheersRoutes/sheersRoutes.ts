import express from 'express';
import staffAuthMiddleware from '../middlewares/staffAuthMiddleware';
import userAuthMiddleware from '../middlewares/userAuthMiddleware';
import {
  createAppointment, getAppointments, cancelAppointment
} from '../appointments/appointmentController';
import {
  createService, getServices, getService, updateService, deleteService
} from '../royalsheerservices/yoyalSheerServicesControllers';
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

const router = express.Router();

// Appointment Routes
router.post('/create/appointments', userAuthMiddleware, createAppointment);
router.get('/list/appointments', userAuthMiddleware, getAppointments);
router.delete('/appointments/:id', userAuthMiddleware, cancelAppointment);

// Service Routes
router.post('/create/services', staffAuthMiddleware, createService);
router.get('/services', staffAuthMiddleware, getServices);
router.get('/services/:id', staffAuthMiddleware, getService);
router.patch('/services/:id', staffAuthMiddleware, updateService);
router.delete('/services/:id', staffAuthMiddleware, deleteService);

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

export default router;
