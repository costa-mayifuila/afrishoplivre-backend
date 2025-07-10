import Notification from '../models/notification.js';

// 📌 Criar Notificação
export const createNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
    });
    await notification.save();
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
  }
};

// 📌 Obter Notificações do Usuário
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar notificações', error });
  }
};

// 📌 Marcar Notificação como Lida
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }

    notification.status = 'lida';
    await notification.save();
    res.json({ message: 'Notificação marcada como lida', notification });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar notificação', error });
  }
};
