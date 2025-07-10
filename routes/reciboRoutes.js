import express from "express";
import { gerarRecibo } from "../controllers/reciboController.js";

const router = express.Router();

router.post("/gerar", gerarRecibo);

export default router;
