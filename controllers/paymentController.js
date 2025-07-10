import multicaixaExpress from '../config/multicaixaExpress.js';

// 📌 Criar pagamento via Multicaixa Express
export const createPayment = async (req, res) => {
  const { phone, amount, reference } = req.body;

  // Validações
  if (!phone || !amount || !reference) {
    return res.status(400).json({ msg: 'Por favor, preencha todos os campos' });
  }
  if (amount <= 0) {
    return res.status(400).json({ msg: 'Valor deve ser maior que zero' });
  }

  try {
    const paymentData = { phone, amount, reference };
    const response = await multicaixaExpress.post('/payments', paymentData);
    res.json(response.data);
  } catch (err) {
    console.error('Erro ao criar pagamento:', err.message);
    res.status(500).send('Erro no servidor');
  }
};

// 📌 Callback de pagamento do Multicaixa Express
export const handlePaymentCallback = async (req, res) => {
  try {
    const { reference, status } = req.body;

    // Atualizar o status do pagamento no banco de dados (ajustar conforme seu modelo)
    console.log(`Pagamento ${reference} está com status: ${status}`);

    res.status(200).send('Callback recebido com sucesso');
  } catch (err) {
    console.error('Erro ao processar callback:', err.message);
    res.status(500).send('Erro no servidor');
  }
};
