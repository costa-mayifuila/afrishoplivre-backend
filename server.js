// server.js (versão ESM)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// 📦 Importar rotas
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import gpoRoutes from "./routes/gpoRoutes.js";
import clipRoutes from "./routes/clipRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import businessAccountRoutes from "./routes/businessAccountRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import reciboRoutes from "./routes/reciboRoutes.js";
import publicoRoutes from "./routes/publicoRoutes.js"; // ✅ Adicionado

// 📁 Diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ⚙️ Configurações iniciais
dotenv.config();
connectDB();

const app = express();

// 🔐 Configurar CORS para frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// 🧠 JSON middleware
app.use(express.json());

// 🔗 Rotas principais
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/gpo", gpoRoutes);
app.use("/api/clips", clipRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/business-account", businessAccountRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/recibos", reciboRoutes);
app.use("/api/publico", publicoRoutes); // ✅ Nova rota para acesso público de produtos

// 📁 Servir arquivos estáticos
app.use("/uploads", express.static(path.resolve(__dirname, "public/uploads")));
app.use("/recibos", express.static(path.resolve(__dirname, "public/recibos")));

// ✅ Rota de teste
app.get("/", (req, res) => {
  res.send("🚀 API do AfriShopLivre está funcionando!");
});

// 🔥 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
