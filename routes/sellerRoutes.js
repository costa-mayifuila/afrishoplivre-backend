import express from "express";
import { getSellerOverview } from "../controllers/sellerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/overview", authMiddleware, getSellerOverview);

export default router;
