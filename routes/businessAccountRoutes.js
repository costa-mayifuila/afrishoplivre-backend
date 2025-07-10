import express from 'express';
import upload from '../middlewares/upload.js';
import { criarContaEmpresarial } from '../controllers/businessAccountController.js';

const router = express.Router();

router.post(
  '/criar',
  upload.fields([
    { name: 'nifFile', maxCount: 1 },
    { name: 'alvaraFile', maxCount: 1 },
    { name: 'docFile', maxCount: 1 },
  ]),
  criarContaEmpresarial
);

export default router;
