import express from 'express';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/ProductController.js';

const router = express.Router();

router.post('/', auth, authorize('admin', 'standard'), createProduct);
router.get('/', auth, authorize('admin', 'standard'), getProducts);
router.get('/:id', auth, authorize('admin', 'standard'), getProduct);
router.put('/:id', auth, authorize('admin'), updateProduct);
router.delete('/:id', auth, authorize('admin'), deleteProduct);

export default router;
