import express from 'express';
import {
  createPayment,
  handlePaymentCallback
} from '../controllers/paymentController.js';

const router = express.Router();

// 📌 Iniciar pagamento via Multicaixa Express
router.post('/pay', createPayment);

// 📌 Callback do Multicaixa Express
router.post('/callback', handlePaymentCallback);

export default router;
