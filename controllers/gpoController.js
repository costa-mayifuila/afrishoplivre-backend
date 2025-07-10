import axios from "axios";
import Transaction from "../models/Transaction.js";
import Order from "../models/Order.js";

// ✅ Solicitar token do WebFrame da EMIS
export const solicitarFrameToken = async (req, res) => {
  try {
    const {
      reference,
      amount,
      cssUrl,
      callbackUrl,
      productId,
      productName,
    } = req.body;

    if (!reference || !amount || !callbackUrl) {
      return res.status(400).json({
        success: false,
        message: "Campos 'reference', 'amount' e 'callbackUrl' são obrigatórios.",
      });
    }

    const emisPayload = {
      reference,
      amount,
      terminalId: process.env.EMIS_TERMINAL_ID,
      token: process.env.EMIS_FRAME_TOKEN,
      callbackUrl,
      qrCode: "PAYMENT",     // ou "PAYMENT" se ativado
      card: "DISABLED",
      mobile: "PAYMENT",
    };

    if (cssUrl && cssUrl.startsWith("https://")) {
      emisPayload.cssUrl = cssUrl;
    }

    console.log("📤 Enviando para EMIS:", emisPayload);

    const emisRes = await axios.post(
      "https://pagamentonline.emis.co.ao/online-payment-gateway/webframe/v1/frameToken",
      emisPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    const { token } = emisRes.data;
    const frameUrl = `https://pagamentonline.emis.co.ao/online-payment-gateway/webframe?frameToken=${token}`;

    if (!token) {
      console.warn("⚠️ Token ausente na resposta da EMIS");
      return res.status(200).json({
        success: false,
        debug: true,
        message: "Token ausente na resposta da EMIS",
        emisResposta: emisRes.data,
      });
    }

    await Transaction.create({
      reference,
      amount,
      token,
      status: "pending",
      metadata: emisRes.data,
      user: req.user?._id || null,
      productId,
      productName,
    });

    return res.status(200).json({ success: true, redirectUrl: frameUrl });

  } catch (error) {
    console.error("❌ Erro ao solicitar frameToken:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Erro ao solicitar frameToken",
      error: error?.response?.data || error.message,
    });
  }
};

// 📥 Processar callback da EMIS
export const processarCallback = async (req, res) => {
  try {
    const { reference, status } = req.body;

    if (!reference || !status) {
      console.warn("⚠️ Dados incompletos no callback da EMIS:", req.body);
      return res.sendStatus(400);
    }

    await Transaction.findOneAndUpdate({ reference }, { status });
    await Order.findOneAndUpdate({ reference }, { status });

    console.log(`📬 Callback processado para ${reference} com status ${status}`);
    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Erro no callback da EMIS:", err.message);
    return res.sendStatus(500);
  }
};

// 🔎 Verificar status da transação
export const checkPaymentStatus = async (req, res) => {
  try {
    const { reference } = req.params;

    const transacao = await Transaction.findOne({ reference });

    if (!transacao) {
      return res.status(404).json({ success: false, message: "Transação não encontrada" });
    }

    return res.json({
      success: true,
      data: {
        reference: transacao.reference,
        status: transacao.status,
        amount: transacao.amount,
        createdAt: transacao.createdAt,
        user: transacao.user,
      },
    });
  } catch (err) {
    console.error("❌ Erro ao verificar status da transação:", err.message);
    return res.status(500).json({ success: false, message: "Erro ao verificar status" });
  }
};
