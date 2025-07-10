import express from "express";
import {
  criarPromocao,
  listarMinhasPromocoes,
  atualizarPromocao,
  alterarStatusPromocao,
  listarPromocoesPublicas,
} from "../controllers/promoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📌 Criar promoção
router.post("/", authMiddleware, criarPromocao);

// 📌 Listar promoções do usuário logado
router.get("/minhas", authMiddleware, listarMinhasPromocoes);

// 📌 Atualizar promoção
router.put("/:id", authMiddleware, atualizarPromocao);

// 📌 Alterar status da promoção (ativo/inativo)
router.patch("/:id", authMiddleware, alterarStatusPromocao);

// 📌 Listar promoções públicas ativas
router.get("/ativas", listarPromocoesPublicas);

export default router;
