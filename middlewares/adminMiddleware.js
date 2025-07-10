import User from '../models/User.js';

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Não autenticado!' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        message: 'Acesso negado! Apenas administradores podem acessar.',
      });
    }

    // ✅ Continua se for admin
    next();
  } catch (error) {
    console.error('Erro no adminMiddleware:', error);
    res.status(500).json({
      message: 'Erro na verificação de administrador',
      error,
    });
  }
};

export default adminMiddleware;
