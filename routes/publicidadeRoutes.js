import express from "express";
import {
  criarAnuncio,
  listarAnunciosDoUsuario,
  atualizarStatusAnuncio,
} from "../controllers/publicidadeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// 🔐 Criar anúncio (com imagem e verificação de saldo)
router.post("/", authMiddleware, upload.single("imagem"), criarAnuncio);

// 🔐 Listar anúncios do usuário logado
router.get("/meus", authMiddleware, listarAnunciosDoUsuario);

// 🔐 Atualizar status (ativo/inativo)
router.put("/:id/status", authMiddleware, atualizarStatusAnuncio);

// 🌐 Listar anúncios públicos (ativos) — para exibir no frontend
router.get("/anuncios", async (req, res) => {
  try {
    const { default: Ad } = await import("../models/Ad.js");

    const anuncios = await Ad.find({ status: "ativo" })
      .limit(10)
      .sort({ createdAt: -1 });

    res.json(anuncios); // ✅ retorna um array real
  } catch (error) {
    console.error("Erro ao buscar anúncios públicos:", error);
    res.status(500).json({ message: "Erro ao buscar anúncios." });
  }
});

export default router;
