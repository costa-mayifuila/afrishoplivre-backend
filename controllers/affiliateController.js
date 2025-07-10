import Affiliate from '../models/affiliate.js';
import Order from '../models/order.js'; // Mesmo que não esteja sendo usado agora, mantive se for necessário depois
import Product from '../models/Product.js';

// 📌 Criar Link de Afiliado
export const createAffiliateLink = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    // Gerar um link único
    const affiliateLink = `${process.env.FRONTEND_URL}/produto/${productId}?ref=${req.user.id}`;

    // Criar afiliado
    const affiliate = new Affiliate({
      user: req.user.id,
      product: productId,
      affiliateLink,
    });

    await affiliate.save();
    res.json(affiliate);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar link de afiliado', error });
  }
};

// 📌 Rastrear Vendas dos Afiliados
export const trackAffiliateSale = async (req, res) => {
  try {
    const { ref } = req.query;
    if (!ref) return res.status(400).json({ message: 'Sem referência de afiliado.' });

    const affiliate = await Affiliate.findOne({ user: ref });

    if (affiliate) {
      affiliate.totalSales += 1;
      affiliate.totalEarnings += req.body.totalAmount * 0.10; // 10% de comissão
      await affiliate.save();
    }

    res.json({ message: 'Venda rastreada com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao rastrear venda', error });
  }
};

// 📌 Obter Ganhos do Afiliado
export const getAffiliateEarnings = async (req, res) => {
  try {
    const earnings = await Affiliate.find({ user: req.user.id });
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar ganhos do afiliado', error });
  }
};
