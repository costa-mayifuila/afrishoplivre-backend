import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from '../controllers/productController.js';
import Product from '../models/Product.js';

const router = express.Router();

// 📦 Criar produto com imagens (até 10)
router.post('/', authMiddleware, upload.array('images', 10), createProduct);

// 🛍️ Listar todos os produtos
router.get('/', getProducts);

// 🔝 Produtos mais vendidos da semana
router.get('/top-sales', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const topProducts = await Product.find({ createdAt: { $gte: oneWeekAgo } })
      .sort({ sales: -1 })
      .limit(50);

    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar produtos mais vendidos' });
  }
});

// 🎯 Ofertas do dia
router.get('/ofertas', async (req, res) => {
  try {
    const today = new Date();
    const offers = await Product.find({
      discountPercentage: { $gt: 0 },
      offerExpiresAt: { $gte: today },
    });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar ofertas', error });
  }
});

// ⏳ Ofertas expirando em 3h
router.get('/ofertas-expirando', async (req, res) => {
  try {
    const now = new Date();
    const threeHoursLater = new Date();
    threeHoursLater.setHours(now.getHours() + 3);

    const expiringOffers = await Product.find({
      discountPercentage: { $gt: 0 },
      offerExpiresAt: { $gte: now, $lte: threeHoursLater },
    });

    res.json(expiringOffers);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar ofertas prestes a expirar', error });
  }
});

// 👤 Produtos do usuário logado
router.get('/my-products', authMiddleware, getMyProducts);

// 💸 Definir uma oferta em um produto
router.put('/oferta/:id', authMiddleware, async (req, res) => {
  try {
    const { discountPercentage, durationInDays } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

    if (discountPercentage <= 0 || discountPercentage > 90) {
      return res.status(400).json({ message: 'Desconto inválido. Escolha entre 1% e 90%.' });
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + durationInDays);

    product.discountPercentage = discountPercentage;
    product.offerExpiresAt = expirationDate;

    await product.save();
    res.json({ message: 'Oferta definida com sucesso!', product });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao definir oferta', error });
  }
});

// ✏️ Atualizar produto
router.put('/:id', authMiddleware, updateProduct);

// ❌ Deletar produto
router.delete('/:id', authMiddleware, deleteProduct);

// 🔍 Obter produto por ID (DEVE FICAR POR ÚLTIMO!)
router.get('/:id', getProductById);

export default router;
