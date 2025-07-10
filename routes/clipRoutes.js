import express from 'express';
import {
  createClip,
  getClips,
  getMyClips,
  likeClip,
  shareClip,
  deleteClip,
  updateClip // ✅ Corrigido aqui
} from '../controllers/clipController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import uploadClip from '../middlewares/uploadClip.js';

const router = express.Router();

// 📤 Criar novo clipe com upload real (apenas vendedores logados)
router.post('/', authMiddleware, uploadClip.single('video'), createClip);

// 📄 Listar todos os clipes públicos
router.get('/', getClips);

// 👤 Listar clipes do usuário logado
router.get('/me', authMiddleware, getMyClips);

// 👍 Curtir clipe
router.post('/:id/like', authMiddleware, likeClip);

// 📢 Compartilhar clipe
router.post('/:id/share', authMiddleware, shareClip);

// ❌ Deletar clipe (apenas o autor pode deletar)
router.delete('/:id', authMiddleware, deleteClip);

// ✏️ Atualizar clipe (link do produto ou vídeo)
router.put('/:id', authMiddleware, uploadClip.single('video'), updateClip);

export default router;
