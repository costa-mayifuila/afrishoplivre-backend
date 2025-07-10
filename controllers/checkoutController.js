// 📌 Iniciar processo de checkout
export const createCheckout = async (req, res) => {
  try {
    const { cart } = req.body; // Recebe o carrinho do frontend

    if (!cart || cart.length === 0) {
      return res.status(400).json({ msg: "O carrinho está vazio" });
    }

    // Simulação de processamento do pedido
    const order = {
      items: cart.map((item) => ({
        title: item.name,
        price: parseFloat(item.price),
        quantity: 1,
      })),
      status: "pendente",
    };

    // Aqui você pode salvar a ordem no banco de dados ou integrar método de pagamento real

    res.json({
      msg: "Checkout iniciado com sucesso",
      order,
    });
  } catch (err) {
    console.error("Erro no checkout:", err.message);
    res.status(500).send("Erro no servidor");
  }
};
