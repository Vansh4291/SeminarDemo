import Supplier from '../models/Supplier.js';

export const supplierService = {
  getSuppliers: async () => {
    return await Supplier.find();
  },
  getSupplierById: async (id) => {
    return await Supplier.findById(id);
  }
};
