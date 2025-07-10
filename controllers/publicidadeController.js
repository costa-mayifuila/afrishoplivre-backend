import Ad from "../models/Ad.js";
import User from "../models/User.js";

// 📌 Criar anúncio com verificação de saldo
export const criarAnuncio = async (req, res) => {
  try {
    const { produto, tipo, orcamento } = req.body;
    const imagem = req.file?.filename;

    if (!produto || !tipo || !orcamento || !imagem) {
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    const user = await User.findById(req.user.id); // 🧠 use `req.user.id` (não _id) se JWT for padrão
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const orcamentoNumerico = parseFloat(orcamento);
    if (isNaN(orcamentoNumerico) || orcamentoNumerico <= 0) {
      return res.status(400).json({ message: "Orçamento inválido." });
    }

    if (user.saldo < orcamentoNumerico) {
      return res.status(400).json({ message: "Saldo insuficiente para criar o anúncio." });
    }

    user.saldo -= orcamentoNumerico;
    await user.save();

    const novoAnuncio = await Ad.create({
      produto,
      tipo,
      orcamento: orcamentoNumerico,
      imagemUrl: `/uploads/anuncios/${imagem}`,
      user: user._id,
    });

    res.status(201).json(novoAnuncio);
  } catch (error) {
    console.error("❌ Erro ao criar anúncio:", error);
    res.status(500).json({ message: "Erro no servidor ao criar o anúncio." });
  }
};

// 📌 Listar anúncios do usuário logado
export const listarAnunciosDoUsuario = async (req, res) => {
  try {
    const anuncios = await Ad.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(anuncios);
  } catch (error) {
    console.error("❌ Erro ao listar anúncios:", error);
    res.status(500).json({ message: "Erro ao buscar anúncios do usuário." });
  }
};

// 📌 Atualizar status do anúncio (ativo ou inativo)
export const atualizarStatusAnuncio = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["ativo", "inativo"].includes(status)) {
      return res.status(400).json({ message: "Status inválido. Use 'ativo' ou 'inativo'." });
    }

    const ad = await Ad.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { status },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ message: "Anúncio não encontrado ou não pertence ao usuário." });
    }

    res.json(ad);
  } catch (error) {
    console.error("❌ Erro ao atualizar status do anúncio:", error);
    res.status(500).json({ message: "Erro ao atualizar status do anúncio." });
  }
};
