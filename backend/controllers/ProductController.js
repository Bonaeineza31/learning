import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const newProduct = await Product.create({ name, description, price, category });
    res.status(201).json({ 
        message: 'Product created successfully', 
        product: { id: newProduct._id, name: newProduct.name, description: newProduct.description, price: newProduct.price, category: newProduct.category } 
    });
  } catch (error) {
    console.error('Error occurred while creating product:', error);
    res.status(500).json({ message: 'Error occurred while creating product' });
  }
};

export const getProducts = async (req, res) => {   
    try {
        const products = await Product.find();
        res.status(200).json({ message: 'Products retrieved successfully', products });
    } catch (error) {
        console.error('Error occurred while fetching products:', error);
        res.status(500).json({ message: 'Error occurred while fetching products' });
    }
};

export const updateProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price, category }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }  
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error occurred while updating product:', error);
        res.status(500).json({ message: 'Error occurred while updating product' });
    }
};

export const deleteProducts = async (req, res) => {
    try { 
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error occurred while deleting product:', error);
        res.status(500).json({ message: 'Error occurred while deleting product' });
    }
};
