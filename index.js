const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Importação das rotas
const orderRoutes = require("./routes/orderRoutes");

// Importação do middleware de erros
const errorHandler = require("./middlewares/errorHandler");

// Configuração do dotenv para variáveis de ambiente
dotenv.config();

// Criando o app Express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Permitir requisições do frontend

// Rota inicial de teste
app.get("/", (req, res) => {
    res.send("🚀 Backend do AfriShopLivre está rodando!");
});

// Rotas da API
app.use("/api/orders", orderRoutes);

// Middleware para tratamento de erros
app.use(errorHandler);

// Conectar ao MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("✅ MongoDB Conectado"))
    .catch(err => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Definir a porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));

const affiliateRoutes = require("./routes/affiliateRoutes");

// Rotas de Afiliados
app.use("/api/affiliates", affiliateRoutes);

const withdrawRoutes = require("./routes/withdrawRoutes");

// Rotas de Saques
app.use("/api/withdraws", withdrawRoutes);

const adminRoutes = require("./routes/adminRoutes");

// Rotas de Administração
app.use("/api/admin", adminRoutes);
