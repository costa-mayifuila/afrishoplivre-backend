import User from "../models/User.js";

export const atualizarPerfilLoja = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // ⬅️ usamos `req.user.id` (não `_id`) para consistência com o authMiddleware

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Atualiza os campos da loja
    const campos = [
      "nomeLoja",
      "descricao",
      "slug",
      "instagram",
      "facebook",
      "whatsapp",
    ];

    campos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        user[campo] = req.body[campo];
      }
    });

    // Atualiza a imagem da capa (se enviada)
    if (req.file) {
      user.capaUrl = `/uploads/capas/${req.file.filename}`;
    }

    await user.save();

    res.json({ message: "✅ Perfil da loja atualizado com sucesso!", user });
  } catch (err) {
    console.error("Erro ao atualizar perfil da loja:", err.message);
    res.status(500).json({ message: "Erro ao atualizar perfil da loja." });
  }
};
