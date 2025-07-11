import Withdraw from '../models/Withdraw.js';
// import sendPushNotification from '../utils/firebaseAdmin.js';  // Comentado, pois não está em uso no momento

// 📌 Aprovar ou Rejeitar Saque (ADMIN)
export const updateWithdrawStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const withdraw = await Withdraw.findById(req.params.id).populate('user');
    if (!withdraw) return res.status(404).json({ message: 'Saque não encontrado' });

    withdraw.status = status;
    await withdraw.save();

    // 📌 Enviar Notificação Push (comentado, pois não está em uso)
    // if (withdraw.user.fcmToken) {
    //   const title = status === 'aprovado' ? '✅ Saque Aprovado!' : '❌ Saque Rejeitado!';
    //   const body = `Seu saque de ${withdraw.amount} AOA foi ${status}.`;
    //   await sendPushNotification(withdraw.user.fcmToken, title, body);
    // }

    res.json({ message: `Saque ${status} com sucesso!`, withdraw });
  } catch (error) {
    console.error("Erro ao atualizar status do saque:", error);
    res.status(500).json({ message: 'Erro ao atualizar status do saque', error });
  }
};

// Aqui você pode comentar ou remover a função `getPendingWithdraws` se não for necessária
/*
export const getPendingWithdraws = async (req, res) => {
  try {
    const pendingWithdraws = await Withdraw.find({ status: 'pendente' });
    res.json(pendingWithdraws);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter saques pendentes', error });
  }
};
*/

// Resto do código...
