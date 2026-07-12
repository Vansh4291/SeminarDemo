import Product from '../models/Product.js';

class ProductService {
  escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  async findProducts(search, category) {
    const query = {};
    
    if (search) {
      const safeSearch = this.escapeRegex(search);
      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'All') {
      const safeCategory = this.escapeRegex(category);
      query.category = { $regex: `^${safeCategory}$`, $options: 'i' };
    }
    
    return await Product.find(query).sort({ createdAt: -1 });
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async getCategories() {
    return await Product.distinct('category');
  }

  async createProduct(input) {
    const product = new Product(input);
    return await product.save();
  }

  async updateProduct(id, input) {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    return updatedProduct;
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  async deleteAllProducts() {
    const result = await Product.deleteMany({});
    return result.deletedCount;
  }

  async bulkInsertProducts(products) {
    // using ordered: false so valid inserts succeed even if some fail
    const result = await Product.insertMany(products, { ordered: false });
    return result.length; // insertMany returns an array of inserted documents
  }
}

export const productService = new ProductService();
