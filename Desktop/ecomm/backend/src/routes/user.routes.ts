import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, updateProfile, getOrders, getFavorites, addFavorite, removeFavorite } from '../controllers/user.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/orders', getOrders);
router.get('/favorites', getFavorites);
router.post('/favorites/:productId', addFavorite);
router.delete('/favorites/:productId', removeFavorite);

export default router;
