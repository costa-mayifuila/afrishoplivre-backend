import Withdraw from '../models/Withdraw.js';
import sendPushNotification from '../utils/firebaseAdmin.js';

// 📌 Aprovar ou Rejeitar Saque (ADMIN)
export const updateWithdrawStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const withdraw = await Withdraw.findById(req.params.id).populate('user');
    if (!withdraw) return res.status(404).json({ message: 'Saque não encontrado' });

    withdraw.status = status;
    await withdraw.save();

    // 📌 Enviar Notificação Push
    if (withdraw.user.fcmToken) {
      const title = status === 'aprovado' ? '✅ Saque Aprovado!' : '❌ Saque Rejeitado!';
      const body = `Seu saque de ${withdraw.amount} AOA foi ${status}.`;
      await sendPushNotification(withdraw.user.fcmToken, title, body);
    }

    res.json({ message: `Saque ${status} com sucesso!`, withdraw });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status do saque', error });
  }
};
