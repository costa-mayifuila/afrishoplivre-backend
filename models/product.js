// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'O nome do produto é obrigatório.'],
    },
    description: {
      type: String,
      required: [true, 'A descrição é obrigatória.'],
      minlength: 15,
    },
    price: {
      type: Number,
      required: [true, 'O preço é obrigatório.'],
    },
    category: {
      type: String,
      required: [true, 'A categoria é obrigatória.'],
    },
    images: [
      {
        url: { type: String },
        filename: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ['pendente', 'ativo', 'inativo'],
      default: 'pendente',
    },

    // 🟨 NOVOS CAMPOS PARA OFERTAS E VENDAS
    sales: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    offerExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
// Adicione indexes para melhor performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Adicione transform para garantir consistência no JSON
productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    //delete ret._id;
    delete ret.__v;
  }
});
export default mongoose.model('Product', productSchema);
