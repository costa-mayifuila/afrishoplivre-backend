import Withdraw from '../models/Withdraw.js';
import Affiliate from '../models/affiliate.js';

// 📌 Solicitar Saque
export const requestWithdraw = async (req, res) => {
  try {
    const { amount, paymentMethod, details } = req.body;
    const affiliate = await Affiliate.findOne({ user: req.user.id });

    if (!affiliate || affiliate.totalEarnings < amount) {
      return res.status(400).json({ message: 'Saldo insuficiente para saque.' });
    }

    // Criar solicitação de saque
    const withdraw = new Withdraw({
      user: req.user.id,
      amount,
      paymentMethod,
      details,
    });

    await withdraw.save();

    // Atualizar saldo do afiliado
    affiliate.totalEarnings -= amount;
    await affiliate.save();

    res.json({ message: 'Saque solicitado com sucesso!', withdraw });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao solicitar saque', error });
  }
};

// 📌 Listar saques do afiliado
export const getUserWithdraws = async (req, res) => {
  try {
    const withdraws = await Withdraw.find({ user: req.user.id });
    res.json(withdraws);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar saques', error });
  }
};

// 📌 Aprovar ou Rejeitar Saque (ADMIN)
export const updateWithdrawStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const withdraw = await Withdraw.findById(req.params.id);

    if (!withdraw) {
      return res.status(404).json({ message: 'Saque não encontrado' });
    }

    withdraw.status = status;
    await withdraw.save();

    res.json({ message: 'Status do saque atualizado!', withdraw });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar saque', error });
  }
};
