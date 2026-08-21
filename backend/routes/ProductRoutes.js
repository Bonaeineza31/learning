import express from 'express';
import auth from '../middleware/auth.js';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/ProductController.js';

const router = express.Router();

router.post('/', auth, createProduct);
router.get('/', auth, getProducts);
router.get('/:id', auth, getProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

export default router;
