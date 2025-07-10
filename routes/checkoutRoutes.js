import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { createCheckout } from '../controllers/checkoutController.js';

const router = express.Router();

// 📦 Criar checkout
router.post('/', authMiddleware, createCheckout);

export default router;
