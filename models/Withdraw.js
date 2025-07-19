import mongoose from 'mongoose';

const WithdrawSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pendente', 'aprovado', 'rejeitado'],
    default: 'pendente',
  },
  paymentMethod: {
    type: String,
    enum: ['banco', 'wallet'],
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Withdraw = mongoose.model('Withdraw', WithdrawSchema);

export default Withdraw;
