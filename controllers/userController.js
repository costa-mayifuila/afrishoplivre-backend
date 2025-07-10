import User from '../models/User.js';

// 📌 Obter meu perfil
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao buscar perfil', error });
  }
};

// 📌 Atualizar meu perfil
export const updateMyProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao atualizar perfil', error });
  }
};

// 📌 Atualizar Token de Notificação Push
export const updateFCMToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ msg: 'Token de notificação é obrigatório!' });
    }

    await User.findByIdAndUpdate(req.user.id, { fcmToken });
    res.json({ message: 'Token de notificação atualizado com sucesso!' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro ao atualizar token', error });
  }
};
