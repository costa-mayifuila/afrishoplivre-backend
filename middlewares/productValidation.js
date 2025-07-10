// middlewares/productValidation.js
import mongoose from 'mongoose';

export const validateProductId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Formato de ID inválido" });
  }
  next();
};

// Adicione no router:
import { validateProductId } from '../middlewares/productValidation.js';
router.get('/:id', validateProductId, getProductById);