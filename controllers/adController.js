import Ad from "../models/Ad.js";
import User from "../models/User.js";

// 📌 Criar anúncio com verificação de saldo
export const criarAnuncio = async (req, res) => {
  try {
    const { produto, tipo, orcamento } = req.body;
    const imagem = req.file?.filename;

    if (!produto || !tipo || !orcamento || !imagem) {
      return res.status(400).json({ message: "Preencha todos os campos." });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    if (user.saldo < orcamento) {
      return res.status(400).json({ message: "Saldo insuficiente." });
    }

    // Debita saldo
    user.saldo -= parseFloat(orcamento);
    await user.save();

    const novoAnuncio = await Ad.create({
      produto,
      tipo,
      orcamento,
      imagemUrl: `/uploads/anuncios/${imagem}`,
      user: user._id,
    });

    res.status(201).json(novoAnuncio);
  } catch (error) {
    console.error("Erro ao criar anúncio:", error);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

// 📌 Listar anúncios do usuário logado
export const listarAnunciosDoUsuario = async (req, res) => {
  try {
    const anuncios = await Ad.find({ user: req.user._id });
    res.json(anuncios);
  } catch (error) {
    console.error("Erro ao listar anúncios:", error);
    res.status(500).json({ message: "Erro ao buscar anúncios." });
  }
};

// 📌 Atualizar status (ativo/inativo)
export const atualizarStatusAnuncio = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ad = await Ad.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { status },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ message: "Anúncio não encontrado." });
    }

    res.json(ad);
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ message: "Erro ao atualizar anúncio." });
  }
};
