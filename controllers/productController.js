import mongoose from 'mongoose';
import Product from '../models/Product.js';
// ... resto do código

// 📌 Criar produto
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Verifica se o usuário está autenticado
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    // Validação básica
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    if (description.length < 150) {
      return res.status(400).json({ message: "A descrição deve ter no mínimo 150 caracteres." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Envie ao menos uma imagem do produto." });
    }

    // Processa as imagens
    const images = req.files.map((file) => ({
      url: `/uploads/produtos/${file.filename}`,
      filename: file.filename,
    }));

    const product = new Product({
      user: req.user._id,
      name,
      description,
      price,
      category,
      images,
    });

    await product.save();
    res.status(201).json({ message: "✅ Produto criado com sucesso!", product });
  } catch (err) {
    console.error("❌ Erro ao criar produto:", err);
    res.status(500).json({ message: "Erro interno ao criar produto." });
  }
};

// 📦 Obter todos os produtos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar produtos." });
  }
};
// 📦 Obter produto por ID - Versão melhorada
export const getProductById = async (req, res) => {
  try {
    console.log("🔍 ID recebido:", req.params.id); // <-- Adicione isso
    // Verifica se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID do produto inválido" });
    }

    const product = await Product.findById(req.params.id).populate('user', 'name email');
    
    if (!product) {
      return res.status(404).json({ 
        message: "Produto não encontrado",
        suggestion: "Verifique se o ID está correto ou se o produto foi removido"
      });
    }

    // Formata a resposta de forma consistente
    const response = {
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      user: {
        _id: product.user._id,
        name: product.user.name
      },
      // Adiciona URL da API para facilitar o frontend
      links: {
        self: `/api/products/${product._id}`,
        user: `/api/users/${product.user._id}`
      }
    };

    res.json(response);
  } catch (err) {
    console.error("Erro detalhado:", err);
    res.status(500).json({ 
      message: "Erro ao buscar o produto",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// ✏️ Atualizar produto
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Produto não encontrado." });
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;

    await product.save();
    res.json({ message: "Produto atualizado com sucesso.", product });
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar produto." });
  }
};

// ❌ Deletar produto
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Produto não encontrado." });
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    await product.deleteOne();
    res.json({ message: "Produto removido com sucesso." });
  } catch (err) {
    res.status(500).json({ message: "Erro ao remover produto." });
  }
};

// 👤 Produtos do próprio usuário
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar seus produtos." });
  }
};
