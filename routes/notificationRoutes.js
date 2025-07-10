import express from 'express';
import {
  getUserNotifications,
  markAsRead,
} from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// 📌 Obter notificações do usuário autenticado
router.get('/', authMiddleware, getUserNotifications);

// 📌 Marcar notificação como lida
router.put('/:id', authMiddleware, markAsRead);

export default router;
