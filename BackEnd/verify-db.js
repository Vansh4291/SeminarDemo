import mongoose from 'mongoose';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Supplier from './models/Supplier.js';

mongoose.connect('mongodb://127.0.0.1:27017/graphql_crud').then(async () => {
  const p = await Product.countDocuments();
  const c = await Category.countDocuments();
  const s = await Supplier.countDocuments();
  
  const pCats = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  
  console.log('Products:', p, 'Categories:', c, 'Suppliers:', s);
  console.log('Distributions:', JSON.stringify(pCats, null, 2));
  
  const sample = await Product.find().limit(2);
  console.log('Sample:', JSON.stringify(sample, null, 2));
  
  process.exit(0);
});
