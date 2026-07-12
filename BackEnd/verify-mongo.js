import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = 'mongodb://127.0.0.1:27017/graphql_crud';

const results = {
  productsCount: 0,
  categoriesCount: 0,
  suppliersCount: 0,
  orphanedCategories: [],
  orphanedSuppliers: [],
  errors: [],
  passed: false
};

async function verifyMongo() {
  console.log('Connecting to MongoDB for verification...');
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection.db;

  const products = await db.collection('products').find({}).toArray();
  const categories = await db.collection('categories').find({}).toArray();
  const suppliers = await db.collection('suppliers').find({}).toArray();

  results.productsCount = products.length;
  results.categoriesCount = categories.length;
  results.suppliersCount = suppliers.length;

  const categoryIds = new Set(categories.map(c => c._id.toString()));
  const supplierIds = new Set(suppliers.map(s => s._id.toString()));

  let hasErrors = false;

  for (const product of products) {
    if (!product.categoryId) {
      results.errors.push(`Product ${product._id} is missing categoryId`);
      hasErrors = true;
    } else if (!categoryIds.has(product.categoryId.toString())) {
      results.orphanedCategories.push({
        productId: product._id.toString(),
        missingCategoryId: product.categoryId.toString()
      });
      hasErrors = true;
    }

    if (!product.supplierId) {
      results.errors.push(`Product ${product._id} is missing supplierId`);
      hasErrors = true;
    } else if (!supplierIds.has(product.supplierId.toString())) {
      results.orphanedSuppliers.push({
        productId: product._id.toString(),
        missingSupplierId: product.supplierId.toString()
      });
      hasErrors = true;
    }
  }

  results.passed = !hasErrors && products.length > 0;
  
  await mongoose.disconnect();

  const outPath = path.join(__dirname, 'mongo_verification_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Mongo verification complete. Results saved to ${outPath}`);
}

verifyMongo().catch(err => {
  console.error("Mongo Verification Script Error:", err);
  process.exit(1);
});
