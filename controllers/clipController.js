import Clip from '../models/Clip.js';

// ✅ Criar um novo clip com upload real de vídeo
export const createClip = async (req, res) => {
  const { productLink } = req.body;

  if (!req.file) {
    return res.status(400).json({ msg: 'O vídeo é obrigatório.' });
  }

  if (!productLink) {
    return res.status(400).json({ msg: 'O link do produto é obrigatório.' });
  }

  try {
    const videoUrl = `/uploads/clips/${req.file.filename}`;

    const clip = new Clip({
      videoUrl,
      productLink,
      seller: req.user.id,
    });

    await clip.save();
    res.status(201).json({ success: true, data: clip });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Erro no servidor.' });
  }
};

// ✅ Listar todos os clips públicos
export const getClips = async (req, res) => {
  try {
    const clips = await Clip.find().populate('seller', 'name');
    res.json({ success: true, data: clips });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Erro no servidor.' });
  }
};

// ✅ Buscar clipes do vendedor logado
export const getMyClips = async (req, res) => {
  try {
    const clips = await Clip.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: clips });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Erro ao buscar seus clipes.' });
  }
};

// ✅ Dar like em um clip
export const likeClip = async (req, res) => {
  try {
    const clip = await Clip.findById(req.params.id);
    if (!clip) {
      return res.status(404).json({ msg: 'Clip não encontrado.' });
    }

    clip.likes += 1;
    await clip.save();
    res.json({ success: true, data: clip });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Erro no servidor.' });
  }
};

// ✅ Compartilhar um clip
export const shareClip = async (req, res) => {
  try {
    const clip = await Clip.findById(req.params.id);
    if (!clip) {
      return res.status(404).json({ msg: 'Clip não encontrado.' });
    }

    clip.shares += 1;
    await clip.save();
    res.json({ success: true, data: clip });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Erro no servidor.' });
  }
};

// ✅ Deletar um clip (somente se for do próprio vendedor)
export const deleteClip = async (req, res) => {
  try {
    const clip = await Clip.findById(req.params.id);
    if (!clip) {
      return res.status(404).json({ msg: 'Clip não encontrado.' });
    }

    if (clip.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Ação não permitida.' });
    }

    await clip.deleteOne();
    res.json({ success: true, msg: 'Clipe deletado com sucesso.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Erro ao deletar clipe.' });
  }
};

// ✅ Atualizar clipe (link do produto e opcionalmente vídeo)
export const updateClip = async (req, res) => {
  try {
    const clip = await Clip.findById(req.params.id);
    if (!clip) {
      return res.status(404).json({ msg: 'Clip não encontrado.' });
    }

    if (clip.seller.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Você não tem permissão para editar este clipe.' });
    }

    if (req.body.productLink) {
      clip.productLink = req.body.productLink;
    }

    if (req.file) {
      clip.videoUrl = `/uploads/clips/${req.file.filename}`;
    }

    await clip.save();
    res.json({ success: true, data: clip });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Erro ao atualizar clipe.' });
  }
};
