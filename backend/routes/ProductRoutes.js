import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/ProductController.js';
import { protect,authorizeAdmin} from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', authorizeAdmin, deleteProduct);

export default router;
