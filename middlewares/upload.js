import multer from "multer";
import path from "path";
import fs from "fs";

// 🗂️ Caminho da pasta: public/uploads/produtos
const pastaUploads = "public/uploads/produtos";

// 🔒 Cria a pasta se não existir
if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads, { recursive: true });
}

// 📦 Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaUploads);
  },
  filename: (req, file, cb) => {
    const nomeUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, nomeUnico);
  },
});

// 🔐 Configuração do multer com suporte a webp
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const tipos = /jpeg|jpg|png|gif|webp/; // ✅ Suporte ao formato WEBP adicionado
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    const valido = tipos.test(ext) && tipos.test(mime);
    cb(valido ? null : new Error("Apenas imagens (jpeg, png, gif, webp) são permitidas."), valido);
  },
});

export default upload;
