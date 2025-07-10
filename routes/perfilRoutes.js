import express from "express";
import { atualizarPerfilLoja } from "../controllers/perfilController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📌 Atualizar perfil da loja (com imagem de capa)
router.put("/perfil-loja", authMiddleware, upload.single("capa"), atualizarPerfilLoja);

export default router;
