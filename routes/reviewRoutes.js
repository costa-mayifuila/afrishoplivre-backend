// routes/reviewRoutes.js
import express from "express";
import { criarReview } from "../controllers/reviewController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", auth, criarReview);

export default router;
