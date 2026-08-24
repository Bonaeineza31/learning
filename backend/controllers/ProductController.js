import mongoose from 'mongoose';
import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const imageUrl = req.file?.path || req.file?.secure_url || req.body.image || '';

    const errors = [];
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanQuantity = typeof quantity === 'number' ? quantity : parseInt(quantity, 10);

    if (!cleanName) {
      errors.push('Product name is required');
    } else if (cleanName.length > 100) {
      errors.push('Product name must be less than 100 characters');
    }

    if (quantity === undefined || quantity === null || quantity === '') {
      errors.push('Product quantity is required');
    } else if (isNaN(cleanQuantity) || cleanQuantity < 0) {
      errors.push('Quantity must be a non-negative number');
    }

    if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
      errors.push('Product image must be a valid URL');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const product = new Product({
      name: cleanName,
      quantity: cleanQuantity,
      image: imageUrl || undefined,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to create product right now',
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch products',
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch product',
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const { name, quantity } = req.body;
    const imageUrl = req.file?.path || req.file?.secure_url || req.body.image || undefined;
    const errors = [];

    if (name !== undefined) {
      const cleanName = typeof name === 'string' ? name.trim() : '';
      if (!cleanName) {
        errors.push('Product name cannot be empty');
      } else if (cleanName.length > 100) {
        errors.push('Product name must be less than 100 characters');
      }
    }

    if (quantity !== undefined) {
      const cleanQuantity = typeof quantity === 'number' ? quantity : parseInt(quantity, 10);
      if (isNaN(cleanQuantity) || cleanQuantity < 0) {
        errors.push('Quantity must be a non-negative number');
      }
    }

    if (imageUrl !== undefined && imageUrl !== null && imageUrl !== '' && !/^https?:\/\//i.test(imageUrl)) {
      errors.push('Product image must be a valid URL');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (quantity !== undefined) update.quantity = typeof quantity === 'number' ? quantity : parseInt(quantity, 10);
    if (imageUrl !== undefined) update.image = imageUrl || undefined;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to update product right now',
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findByIdAndDelete(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to delete product right now',
    });
  }
};
