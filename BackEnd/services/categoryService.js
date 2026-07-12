import Category from '../models/Category.js';

export const categoryService = {
  getCategories: async () => {
    return await Category.find();
  },
  getCategoryById: async (id) => {
    return await Category.findById(id);
  }
};
