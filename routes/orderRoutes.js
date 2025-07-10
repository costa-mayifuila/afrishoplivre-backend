// routes/orderRoutes.js
import express from "express";
import { createOrder, getUserOrders, updateOrderStatus } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📌 Criar novo pedido
router.post("/", authMiddleware, createOrder);

// 📌 Buscar pedidos do usuário logado
router.get("/me", authMiddleware, getUserOrders);

// 📌 Atualizar apenas o status do pedido (admin ou vendedor)
router.put("/:id/status", authMiddleware, updateOrderStatus);

export default router;
