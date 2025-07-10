import express from "express";
import fileUpload from "express-fileupload";
import sharp from "sharp";
import axios from "axios";
import Product from "../models/Product.js";

const router = express.Router();

// Ativar upload de arquivos
router.use(fileUpload());

// 🚀 Processar pesquisa por imagem
router.post("/image-search", async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Nenhuma imagem enviada." });
    }

    const image = req.files.image;

    // 📌 Redimensionar a imagem para 224x224 (ideal para IA)
    const processedImage = await sharp(image.data).resize(224, 224).toBuffer();

    // 📌 Enviar imagem para uma API externa de reconhecimento visual
    const response = await axios.post(
      "https://api.example.com/ai-image-search", // Substituir por API real
      processedImage,
      {
        headers: { "Content-Type": "application/octet-stream" },
      }
    );

    // 📌 Buscar produtos semelhantes com base na categoria retornada pela IA
    const similarProducts = await Product.find({
      category: response.data.category, // Exemplo: "Eletrônicos"
    });

    res.json({ products: similarProducts });
  } catch (error) {
    console.error("❌ Erro na pesquisa por imagem:", error.message);
    res.status(500).json({ message: "Erro ao processar a imagem." });
  }
});

export default router;
