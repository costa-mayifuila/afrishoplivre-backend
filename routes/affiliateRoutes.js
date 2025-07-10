import express from 'express';
import {
  createAffiliateLink,
  trackAffiliateSale,
  getAffiliateEarnings
} from '../controllers/affiliateController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Criar link de afiliado
router.post('/create', authMiddleware, createAffiliateLink);

// Rastrear venda de afiliado
router.post('/track', trackAffiliateSale);

// Obter ganhos do afiliado
router.get('/earnings', authMiddleware, getAffiliateEarnings);

export default router;
