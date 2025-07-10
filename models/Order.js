import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["multicaixa", "card", "qr_code", "other"],
      default: "multicaixa",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled", "failed", "expired"],
      default: "pending",
    },
    reference: { type: String, required: true, unique: true },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    transactionDetails: {
      provider: { type: String, default: "EMIS" },
      raw: { type: mongoose.Schema.Types.Mixed, default: {} },
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);