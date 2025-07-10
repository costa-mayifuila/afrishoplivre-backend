import User from '../models/User.js';
import Order from '../models/Order.js';
import Withdraw from '../models/Withdraw.js';

export const getAdminDashboard = async (req, res) => {
  try {
    // 📊 Total de usuários e pedidos
    const totalUsuarios = await User.countDocuments();
    const totalPedidos = await Order.countDocuments();
    const pedidos = await Order.find();
    const saques = await Withdraw.find();

    // 💰 Faturamento total
    const faturamentoTotal = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);

    // 📈 Agrupamento por mês
    const vendasMensais = {};
    const saquesMensais = {};

    pedidos.forEach((pedido) => {
      const mes = new Date(pedido.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      vendasMensais[mes] = (vendasMensais[mes] || 0) + pedido.total;
    });

    saques.forEach((saque) => {
      const mes = new Date(saque.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      saquesMensais[mes] = (saquesMensais[mes] || 0) + saque.valor;
    });

    // 🔁 Resposta JSON padronizada
    res.json({
      totalUsuarios,
      totalPedidos,
      faturamentoTotal,
      vendasMensais,
      saquesMensais,
    });

  } catch (err) {
    console.error('Erro no dashboard admin:', err.message);
    res.status(500).json({ msg: 'Erro ao carregar dados do dashboard admin.' });
  }
};
