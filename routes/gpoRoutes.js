import express from "express";
import {
  solicitarFrameToken,
  processarCallback,
  checkPaymentStatus
} from "../controllers/gpoController.js";

const router = express.Router();

router.post("/solicitar-token", solicitarFrameToken);
router.post("/callback", processarCallback);
router.get("/status/:reference", checkPaymentStatus);

export default router;
