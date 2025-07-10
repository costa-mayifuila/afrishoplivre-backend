import express from 'express';
import { getAdminDashboard } from '../controllers/adminController.js';
import { getPendingWithdraws, updateWithdrawStatus } from '../controllers/adminWithdrawController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/adminMiddleware.js'; // unificado para um nome só

const router = express.Router();

// 📊 Dashboard Administrativo (Usuários, Vendas, Faturamento)
router.get('/dashboard', authMiddleware, isAdmin, getAdminDashboard);

// 💸 Listar saques pendentes (Apenas administradores)
router.get('/withdraws', authMiddleware, isAdmin, getPendingWithdraws);

// ✅ Atualizar status do saque (Aprovar/Rejeitar)
router.put('/withdraws/:id', authMiddleware, isAdmin, updateWithdrawStatus);

export default router;
