import Promo from "../models/Promo.js";
import User from "../models/User.js";

// 🔸 Criar promoção
export const criarPromocao = async (req, res) => {
  try {
    const { produto, desconto, validade } = req.body;

    if (!produto || !desconto || !validade) {
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    if (isNaN(desconto) || desconto <= 0 || desconto > 90) {
      return res.status(400).json({ message: "Desconto inválido (1% a 90%)." });
    }

    const novaPromocao = new Promo({
      produto,
      desconto,
      validade,
      user: req.user.id,
    });

    await novaPromocao.save();

    res.status(201).json(novaPromocao);
  } catch (error) {
    console.error("Erro ao criar promoção:", error);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

// 🔸 Listar promoções do usuário logado
export const listarMinhasPromocoes = async (req, res) => {
  try {
    const promos = await Promo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(promos);
  } catch (error) {
    console.error("Erro ao buscar promoções:", error);
    res.status(500).json({ message: "Erro ao buscar promoções." });
  }
};

// 🔸 Atualizar promoção (produto, desconto, validade)
export const atualizarPromocao = async (req, res) => {
  try {
    const { id } = req.params;
    const { produto, desconto, validade } = req.body;

    const atualizada = await Promo.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { produto, desconto, validade },
      { new: true }
    );

    if (!atualizada) {
      return res.status(404).json({ message: "Promoção não encontrada." });
    }

    res.json(atualizada);
  } catch (error) {
    console.error("Erro ao atualizar promoção:", error);
    res.status(500).json({ message: "Erro ao atualizar promoção." });
  }
};

// 🔸 Ativar ou desativar promoção com verificação de saldo
export const alterarStatusPromocao = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["ativo", "inativo"].includes(status)) {
      return res.status(400).json({ message: "Status inválido." });
    }

    const promo = await Promo.findOne({ _id: id, user: req.user.id });
    if (!promo) {
      return res.status(404).json({ message: "Promoção não encontrada." });
    }

    const user = await User.findById(req.user.id);

    if (status === "ativo" && user.saldo < 500) {
      return res.status(400).json({ message: "Saldo insuficiente para ativar promoção (mínimo 500 Kz)." });
    }

    promo.status = status;
    await promo.save();

    if (status === "ativo") {
      user.saldo -= 500;
      await user.save();
    }

    res.json({ message: `Promoção ${status} com sucesso!`, promo });
  } catch (error) {
    console.error("Erro ao alterar status da promoção:", error);
    res.status(500).json({ message: "Erro ao alterar status da promoção." });
  }
};

// 🔸 Listar promoções públicas (ativas)
export const listarPromocoesPublicas = async (req, res) => {
  try {
    const promocoes = await Promo.find({ status: "ativo" })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("produto", "name price images");

    res.json(promocoes);
  } catch (error) {
    console.error("Erro ao buscar promoções públicas:", error);
    res.status(500).json({ message: "Erro ao buscar promoções públicas." });
  }
};
