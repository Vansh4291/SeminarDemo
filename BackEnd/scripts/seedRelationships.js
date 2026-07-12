import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from BackEnd root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Supplier from '../models/Supplier.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory-demo';

async function seedRelationships() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Create Suppliers if missing
    const supplierNames = ['Tech Solutions Inc.', 'Global Furniture Co.', 'Fashion Forward Logistics'];
    const suppliers = [];
    for (const name of supplierNames) {
      let supplier = await Supplier.findOne({ name });
      if (!supplier) {
        supplier = await Supplier.create({ name, contact: 'contact@' + name.replace(/ /g, '').toLowerCase() + '.com' });
        console.log(`Created supplier: ${name}`);
      }
      suppliers.push(supplier);
    }

    // 2. Fetch all products
    const products = await Product.find();
    if (products.length === 0) {
      console.log('No products found to migrate. Please run main seed script first.');
      process.exit(0);
    }

    // 3. Extract unique categories from products
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const categoriesMap = {}; // name -> _id

    for (const catName of uniqueCategories) {
      let category = await Category.findOne({ name: catName });
      if (!category) {
        category = await Category.create({ name: catName, description: `${catName} items` });
        console.log(`Created category: ${catName}`);
      }
      categoriesMap[catName] = category._id;
    }

    // 4. Update products with categoryId and supplierId if they don't have them
    let updatedCount = 0;
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      let changed = false;

      // Only update if not already set, making it idempotent
      if (!p.categoryId && p.category && categoriesMap[p.category]) {
        p.categoryId = categoriesMap[p.category];
        changed = true;
      }
      
      if (!p.supplierId) {
        // Assign a random supplier predictably based on index
        p.supplierId = suppliers[i % suppliers.length]._id;
        changed = true;
      }

      if (changed) {
        await p.save();
        updatedCount++;
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

seedRelationships();
