import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  let token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado, token não encontrado!' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧠 Suporte a várias estruturas de payload
    const userId = decoded.user?.id || decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({ msg: 'Token inválido. ID do usuário ausente.' });
    }

    req.user = { _id: userId }; // 👈 Aqui é a correção importante!
    next();
  } catch (err) {
    console.error('❌ Erro ao verificar token:', err.message);
    res.status(401).json({ msg: 'Token inválido!' });
  }
};

export default authMiddleware;
