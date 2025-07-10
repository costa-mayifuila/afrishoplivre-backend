import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    // 📌 Referência única da transação (usada na EMIS)
    reference: {
      type: String,
      required: true,
      unique: true,
    },

    // 💰 Valor da transação em Kz (inteiro)
    amount: {
      type: Number,
      required: true,
    },

    // 🟢 Token recebido da EMIS (frameToken)
    token: {
      type: String,
      required: true,
    },

    // 📦 Status atual da transação
    status: {
      type: String,
      enum: ['pending', 'approved', 'cancelled', 'failed', 'expired'],
      default: 'pending',
    },

    // 🔗 ID da transação retornado pela EMIS (opcional)
    externalId: {
      type: String,
      default: null,
    },

    // 👤 Usuário que realizou a transação (opcional)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },

    // 📋 Dados adicionais retornados pela EMIS (resposta completa)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // 🕒 Cria createdAt e updatedAt automaticamente
  }
);

// 📄 Modelo da transação
const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
