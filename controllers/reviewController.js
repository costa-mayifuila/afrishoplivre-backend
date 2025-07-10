// controllers/reviewController.js
import Review from "../models/Review.js";

export const criarReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const reviewExistente = await Review.findOne({
      userId: req.user.id,
      productId,
    });

    if (reviewExistente) {
      return res.status(400).json({ message: "Você já avaliou esse produto." });
    }

    const review = new Review({
      productId,
      userId: req.user.id,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Avaliação enviada com sucesso!", review });
  } catch (error) {
    res.status(500).json({ message: "Erro ao enviar avaliação", error });
  }
};
