import express from "express";
import {
  requestWithdraw,
  getUserWithdraws,
  updateWithdrawStatus,
} from "../controllers/withdrawController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📌 Solicitar Saque
router.post("/", authMiddleware, requestWithdraw);

// 📌 Obter saques do usuário
router.get("/", authMiddleware, getUserWithdraws);

// 📌 Atualizar status do saque (ADMIN)
router.put("/:id", authMiddleware, updateWithdrawStatus);

export default router;
