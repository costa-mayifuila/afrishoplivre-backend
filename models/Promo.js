import mongoose from "mongoose";

const promoSchema = new mongoose.Schema(
  {
    produto: { type: String, required: true },
    desconto: { type: Number, required: true },
    validade: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["ativo", "inativo"], default: "ativo" },
  },
  { timestamps: true }
);

export default mongoose.model("Promo", promoSchema);
