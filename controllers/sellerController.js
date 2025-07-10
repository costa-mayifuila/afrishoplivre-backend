import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getSellerOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    // Produtos do vendedor
    const totalProdutos = await Product.countDocuments({ user: userId });

    // Pedidos que incluem produtos do vendedor
    const pedidos = await Order.find({ "items.user": userId });

    let totalVendas = 0;
    let receita = 0;

    pedidos.forEach((pedido) => {
      pedido.items.forEach((item) => {
        if (item.user.toString() === userId.toString()) {
          totalVendas += item.qty;
          receita += item.price * item.qty;
        }
      });
    });

    res.json({
      totalProdutos,
      totalVendas,
      receita,
    });
  } catch (error) {
    console.error("Erro ao buscar overview do vendedor:", error);
    res.status(500).json({ message: "Erro ao buscar estatísticas." });
  }
};
