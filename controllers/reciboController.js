import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const gerarRecibo = async (req, res) => {
  try {
    const { pedidoId, produtos, total, dataCompra } = req.body;

    const doc = new PDFDocument();
    const fileName = `recibo_${pedidoId}.pdf`;
    const filePath = path.join("public", "recibos", fileName);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("🧾 Recibo de Compra", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`📅 Data: ${dataCompra}`);
    doc.text(`🆔 Pedido: ${pedidoId}`);
    doc.moveDown();
    doc.fontSize(16).text("📦 Produtos:");

    produtos.forEach((item, i) => {
      doc.fontSize(12).text(`- ${item.nome} x ${item.quantidade}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`💰 Total Pago: ${total} AOA`, { align: "right" });

    doc.end();

    res.status(200).json({
      message: "Recibo gerado com sucesso!",
      link: `/recibos/${fileName}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Erro ao gerar recibo", error: err });
  }
};
