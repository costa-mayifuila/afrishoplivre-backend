import express from "express";
import {
  criarAnuncio,
  listarAnunciosDoUsuario,
  atualizarStatusAnuncio,
} from "../controllers/adController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js"; // ✅ Corrigido aqui
import Ad from "../models/Ad.js";

const router = express.Router();

// 📌 POST - Criar anúncio
router.post("/", authMiddleware, upload.single("imagem"), criarAnuncio); // ✅ Corrigido aqui

// 📌 GET - Listar anúncios do usuário logado
router.get("/meus", authMiddleware, listarAnunciosDoUsuario);

// 📌 GET - Obter um anúncio por ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const anuncio = await Ad.findOne({ _id: req.params.id, user: req.user._id });
    if (!anuncio) return res.status(404).json({ message: "Anúncio não encontrado." });
    res.json(anuncio);
  } catch {
    res.status(500).json({ message: "Erro ao buscar anúncio." });
  }
});

// 📌 PUT - Atualizar dados do anúncio
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { produto, tipo, orcamento } = req.body;
    const anuncio = await Ad.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { produto, tipo, orcamento },
      { new: true }
    );
    if (!anuncio) return res.status(404).json({ message: "Anúncio não encontrado." });
    res.json(anuncio);
  } catch {
    res.status(500).json({ message: "Erro ao atualizar anúncio." });
  }
});

// 📌 PATCH - Atualizar status do anúncio
router.patch("/:id", authMiddleware, atualizarStatusAnuncio);

export default router;
