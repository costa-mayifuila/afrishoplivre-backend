import BusinessAccount from "../models/BusinessAccount.js";

// 📌 Criar Conta Empresarial
export const criarContaEmpresarial = async (req, res) => {
  try {
    const { empresa, nif } = req.body;

    const alvara = req.files?.alvaraFile?.[0]?.path || null;
    const documentos = [];

    if (req.files?.nifFile?.[0]) documentos.push(req.files.nifFile[0].path);
    if (req.files?.docFile?.[0]) documentos.push(req.files.docFile[0].path);

    // Verificar se já existe uma conta empresarial para o usuário
    const existente = await BusinessAccount.findOne({ user: req.user.id });
    if (existente) {
      return res
        .status(400)
        .json({ message: "Conta empresarial já cadastrada." });
    }

    const conta = new BusinessAccount({
      user: req.user.id,
      empresa,
      nif,
      alvaraPath: alvara,
      documentosAdicionais: documentos,
    });

    await conta.save();

    res.status(201).json({
      message: "Conta empresarial criada com sucesso!",
      conta,
    });
  } catch (error) {
    console.error("❌ Erro ao criar conta empresarial:", error);
    res
      .status(500)
      .json({ message: "Erro ao enviar conta empresarial", error });
  }
};
