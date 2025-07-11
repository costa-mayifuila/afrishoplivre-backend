import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Affiliate from "../models/affiliate.js";
// import sendPushNotification from "../utils/firebaseAdmin.js";

// 📌 Criar Pedido (com rastreamento de afiliado e notificação push)
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, reference, ref } = req.body;

    // Validação de parâmetros obrigatórios
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "O pedido deve conter ao menos um item." });
    }
    if (!totalAmount || !paymentMethod || !reference) {
      return res.status(400).json({ message: "O valor total, método de pagamento e referência são obrigatórios." });
    }

    // Processar itens do pedido
    const processedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Produto não encontrado.");

        return {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity || 1,
        };
      })
    );

    const newOrder = new Order({
      user: req.user.id,
      items: processedItems,
      totalAmount,
      paymentMethod,
      reference,
    });

    const savedOrder = await newOrder.save();

    // ✅ Se for venda afiliada
    if (ref) {
      const affiliate = await Affiliate.findOne({ user: ref }).populate("user");
      if (affiliate) {
        const commission = totalAmount * 0.1;
        affiliate.totalEarnings += commission;
        affiliate.totalSales += 1;
        await affiliate.save();

        // ✅ Enviar notificação push (opcional)
        // if (affiliate.user?.fcmToken) {
        //   const title = "🎉 Nova Venda Afiliada!";
        //   const body = `Você ganhou ${commission.toFixed(2)} AOA de comissão!`;
        //   try {
        //     await sendPushNotification(affiliate.user.fcmToken, title, body);
        //   } catch (pushError) {
        //     console.error("Erro ao enviar notificação push:", pushError);
        //   }
        // }
      }
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ message: "Erro ao criar pedido", error: error.message });
  }
};

// 📌 Buscar pedidos do usuário logado
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ message: "Erro ao buscar pedidos", error: error.message });
  }
};

// 📌 Atualizar status do pedido
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado." });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    res.status(500).json({ message: "Erro ao atualizar pedido", error: error.message });
  }
};
