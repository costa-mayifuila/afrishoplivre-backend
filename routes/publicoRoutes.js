import express from "express";
import Ad from "../models/Ad.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Promo from "../models/Promo.js";

const router = express.Router();

// 🔹 Rota: Listar anúncios públicos
router.get("/anuncios", async (req, res) => {
  try {
    const anuncios = await Ad.find({ status: "ativo" })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(anuncios);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar anúncios." });
  }
});

// 🔹 Rota: Página pública do vendedor
router.get("/loja/:slug", async (req, res) => {
  try {
    const vendedor = await User.findOne({ slug: req.params.slug }).select("-password");
    if (!vendedor) return res.status(404).json({ message: "Vendedor não encontrado." });

    const produtos = await Product.find({ user: vendedor._id, status: "ativo" });
    const promocoes = await Promo.find({ user: vendedor._id, status: "ativo" });

    res.json({ vendedor, produtos, promocoes });
  } catch (error) {
    console.error("Erro ao buscar loja pública:", error);
    res.status(500).json({ message: "Erro ao buscar loja pública." });
  }
});

// ✅ NOVA ROTA: Obter produto individual por ID (página de detalhes do produto)
router.get("/produto/:id", async (req, res) => {
  try {
    const produto = await Product.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    res.json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto público:", error);
    res.status(500).json({ message: "Erro ao buscar produto." });
  }
});

export default router;
