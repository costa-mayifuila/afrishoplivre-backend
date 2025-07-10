import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    produto: { type: String, required: true },
    tipo: { type: String, enum: ["destaque", "home", "segmentado"], required: true },
    orcamento: { type: Number, required: true },
    imagemUrl: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["ativo", "inativo"], default: "ativo" },
  },
  { timestamps: true }
);

export default mongoose.model("Ad", adSchema);
