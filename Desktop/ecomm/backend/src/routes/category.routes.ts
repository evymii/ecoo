import express from 'express';
import { getAllCategories } from '../controllers/category.controller.js';

const router = express.Router();

// Public route to get all active categories
router.get('/', getAllCategories);

export default router;
