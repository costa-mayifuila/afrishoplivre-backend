// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Rotas
import orderRoutes from "./routes/orderRoutes.js";
import affiliateRoutes from "./routes/affiliateRoutes.js";
import withdrawRoutes from "./routes/withdrawRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Middleware de erros
import errorHandler from "./middlewares/errorHandler.js";

// Configura variáveis de ambiente
dotenv.config();

// Inicia app Express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Rota raiz de teste
app.get("/", (req, res) => {
  res.send("🚀 Backend do AfriShopLivre está rodando!");
});

// Rotas da API
app.use("/api/orders", orderRoutes);
app.use("/api/affiliates", affiliateRoutes);
app.use("/api/withdraws", withdrawRoutes);
app.use("/api/admin", adminRoutes);

// Middleware de erro
app.use(errorHandler);

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Conectado"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Inicia servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
