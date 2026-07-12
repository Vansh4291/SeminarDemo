import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { supplierService } from '../services/supplierService.js';

export const resolvers = {
  Query: {
    products: (_, { search, category }) => 
      productService.findProducts(search, category),
    
    product: (_, { id }) => 
      productService.getProductById(id),

    categories: () => 
      productService.getCategories()
  },

  Product: {
    categoryDetails: async (parent) => {
      if (!parent.categoryId) return null;
      return await categoryService.getCategoryById(parent.categoryId);
    },
    supplier: async (parent) => {
      if (!parent.supplierId) return null;
      return await supplierService.getSupplierById(parent.supplierId);
    }
  },

  Mutation: {
    createProduct: (_, { input }) => 
      productService.createProduct(input),

    updateProduct: (_, { id, input }) => 
      productService.updateProduct(id, input),

    deleteProduct: async (_, { id }) => {
      const deleted = await productService.deleteProduct(id);
      return !!deleted;
    },

    deleteAllProducts: async () => {
      try {
        const affectedCount = await productService.deleteAllProducts();
        return {
          success: true,
          affectedCount,
          message: `Deleted ${affectedCount} products.`
        };
      } catch (error) {
        return { success: false, affectedCount: 0, message: error.message };
      }
    },

    bulkInsertProducts: async (_, { products }) => {
      try {
        const affectedCount = await productService.bulkInsertProducts(products);
        return {
          success: true,
          affectedCount,
          message: `Inserted ${affectedCount} products.`
        };
      } catch (error) {
        if (error.insertedDocs) {
          return {
            success: true,
            affectedCount: error.insertedDocs.length,
            message: `Inserted ${error.insertedDocs.length} products with some failures.`
          };
        }
        return { success: false, affectedCount: 0, message: error.message };
      }
    }
  }
};
