import { productService } from '../services/productService.js';

export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const products = await productService.findProducts(search, category);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Valid name is required' });
    }
    if (price === undefined || price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json(product);
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ 
      message: 'Deleted',
      deletedId: deletedProduct._id,
      product: deletedProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    const deletedCount = await productService.deleteAllProducts();
    res.status(200).json({
      success: true,
      affectedCount: deletedCount,
      message: `Deleted ${deletedCount} products.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const bulkInsertProducts = async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Valid array of products is required' });
    }
    const insertedCount = await productService.bulkInsertProducts(products);
    res.status(201).json({
      success: true,
      affectedCount: insertedCount,
      message: `Inserted ${insertedCount} products.`
    });
  } catch (error) {
    console.error(error);
    // If it's a validation error or partial insertion error from Mongoose
    if (error.insertedDocs) {
        res.status(207).json({
            success: true,
            affectedCount: error.insertedDocs.length,
            message: `Inserted ${error.insertedDocs.length} products with some failures.`
        });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
