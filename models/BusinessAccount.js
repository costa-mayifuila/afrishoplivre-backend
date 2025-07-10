import mongoose from 'mongoose';

const businessAccountSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    empresa: { type: String, required: true },
    nif: { type: String, required: true },
    alvaraPath: { type: String },
    documentosAdicionais: [{ type: String }],
    status: {
      type: String,
      enum: ['pendente', 'verificada', 'rejeitada'],
      default: 'pendente',
    },
  },
  { timestamps: true }
);

const BusinessAccount = mongoose.model('BusinessAccount', businessAccountSchema);

export default BusinessAccount;
