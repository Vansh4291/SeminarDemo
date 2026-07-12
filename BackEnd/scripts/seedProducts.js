import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Simulate loading dotenv from the backend root
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Supplier from '../models/Supplier.js';

const TARGET_COUNT = process.env.SEED_TARGET ? parseInt(process.env.SEED_TARGET, 10) : 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/graphql_crud';

// Themed datasets
const themes = {
  'Electronics': ['Smart TV', 'OLED Monitor', 'Smartwatch', 'E-Reader', 'Tablet'],
  'Computer Accessories': ['Mechanical Keyboard', 'Wireless Mouse', 'USB-C Hub', 'Webcam', 'Laptop Stand'],
  'Mobile Phones': ['Galaxy S', 'iPhone', 'Pixel', 'OnePlus', 'Xperia'],
  'Home Appliances': ['Microwave', 'Air Purifier', 'Robot Vacuum', 'Coffee Maker', 'Blender'],
  'Gaming': ['Gaming Console', 'VR Headset', 'Gaming Mouse', 'Gaming Chair', 'Mechanical Switch Set'],
  'Office Supplies': ['Ergonomic Chair', 'Standing Desk', 'Notebook Set', 'Gel Pens', 'Desk Organizer'],
  'Audio Devices': ['Noise Cancelling Headphones', 'Wireless Earbuds', 'Bluetooth Speaker', 'Soundbar', 'Studio Microphone'],
  'Cameras': ['Mirrorless Camera', 'DSLR', 'Action Camera', 'Security Camera', 'Polaroid']
};

const adjectives = ['Pro', 'Max', 'Ultra', 'Lite', 'Plus', 'Essential', 'Advanced', 'Elite', 'Premium', 'Basic'];
const brands = ['TechCorp', 'Globex', 'Initech', 'Acme', 'Stark', 'Wayne', 'Umbrella', 'Massive Dynamic'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProductName(themeName) {
  const baseProduct = getRandomItem(themes[themeName]);
  const adjective = getRandomItem(adjectives);
  const brand = getRandomItem(brands);
  const modelNumber = Math.floor(Math.random() * 900) + 100;
  
  return `${brand} ${baseProduct} ${adjective} ${modelNumber}`;
}

async function seed() {
  console.log(`Starting seed process. Target: ${TARGET_COUNT} products.`);
  const startTime = Date.now();

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Ensure themed categories exist
    const categoriesMap = new Map();
    for (const theme of Object.keys(themes)) {
      let category = await Category.findOne({ name: theme });
      if (!category) {
        category = await Category.create({ name: theme, description: `${theme} products` });
      }
      categoriesMap.set(theme, category);
    }
    
    // Also fetch any existing categories not in the theme list to reuse them
    const allCategories = await Category.find();
    for (const cat of allCategories) {
      if (!categoriesMap.has(cat.name)) {
        categoriesMap.set(cat.name, cat);
      }
    }
    const categoryNames = Array.from(categoriesMap.keys());

    // Fetch existing suppliers
    let suppliers = await Supplier.find();
    if (suppliers.length === 0) {
      // Create a default supplier if none exist (though the prompt says reuse, we must ensure at least one exists)
      const newSupplier = await Supplier.create({ name: 'Default Supplier', contact: 'default@supplier.com' });
      suppliers.push(newSupplier);
    }

    const currentCount = await Product.countDocuments();
    console.log(`Existing products: ${currentCount}`);

    const toInsert = TARGET_COUNT - currentCount;
    if (toInsert <= 0) {
      console.log(`Database already has ${currentCount} products. No new products inserted.`);
      console.log(`Final count: ${currentCount}`);
      console.log(`Execution time: ${Date.now() - startTime}ms`);
      process.exit(0);
    }

    console.log(`Generating ${toInsert} products...`);
    const batchSize = 500;
    let insertedCount = 0;

    for (let i = 0; i < toInsert; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, toInsert - i);
      const batch = [];

      for (let j = 0; j < currentBatchSize; j++) {
        // Distribute evenly across categories
        const catName = categoryNames[(i + j) % categoryNames.length];
        const category = categoriesMap.get(catName);
        
        // Distribute evenly across suppliers
        const supplier = suppliers[(i + j) % suppliers.length];

        // Only use the theme generator if the category is in our themes object, otherwise use a generic generator
        let name;
        if (themes[catName]) {
          name = generateProductName(catName);
        } else {
          name = `${getRandomItem(brands)} Generic ${catName} Item ${Math.floor(Math.random() * 10000)}`;
        }
        
        // Ensure uniqueness for the name by appending a unique counter to avoid duplicate key errors (if any index exists, though schema says required, not unique, but unique is good)
        name = `${name} - ID${currentCount + i + j}`;

        batch.push({
          name,
          description: `This is a high-quality ${name}. Perfect for your needs.`,
          price: Math.floor(Math.random() * (100000 - 100) + 100),
          stock: Math.floor(Math.random() * 501), // 0 to 500
          category: category.name,
          categoryId: category._id,
          supplierId: supplier._id
        });
      }

      await Product.insertMany(batch);
      insertedCount += currentBatchSize;
      console.log(`Inserted ${insertedCount} / ${toInsert} products...`);
    }

    const finalCount = await Product.countDocuments();
    console.log('\n--- Seeding Complete ---');
    console.log(`Existing products: ${currentCount}`);
    console.log(`Inserted count: ${insertedCount}`);
    console.log(`Final count: ${finalCount}`);
    console.log(`Execution time: ${Date.now() - startTime}ms`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
