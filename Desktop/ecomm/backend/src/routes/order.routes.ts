import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createOrder, getOrderById } from '../controllers/order.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/:id', getOrderById);

export default router;
