import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
  updateFCMToken,
} from "../controllers/userController.js";

const router = express.Router();

// 📌 Obter perfil do usuário logado
router.get("/me", authMiddleware, getMyProfile);

// 📌 Atualizar perfil do usuário logado
router.put("/me", authMiddleware, updateMyProfile);

// 📌 Atualizar Token de Notificação Push
router.post("/update-token", authMiddleware, updateFCMToken);

export default router;
