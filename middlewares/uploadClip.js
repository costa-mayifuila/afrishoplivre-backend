// middlewares/uploadClip.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ✅ Permite usar __dirname com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Define onde os vídeos serão salvos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../public/uploads/clips'));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

// ✅ Filtra por tipos de vídeo permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi|webm/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo inválido. Apenas vídeos são permitidos.'));
  }
};

// ✅ Exporta o middleware para uso nas rotas
const uploadClip = multer({ storage, fileFilter });
export default uploadClip;
