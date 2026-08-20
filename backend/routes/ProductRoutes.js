import express from 'express';
import { createProduct, getProducts, updateProducts, deleteProducts } from '../controllers/ProductController.js';
import { protect, adminOnly } from '../middlewares/loginmiddle.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.put('/:id', protect, updateProducts);
router.delete('/:id', protect, adminOnly, deleteProducts);

export default router;