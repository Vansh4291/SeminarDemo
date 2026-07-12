const PRODUCT_NAMES = [
  'Wireless Mouse', 'Gaming Keyboard', 'Bluetooth Speaker', 'USB-C Cable', 
  'Laptop Stand', 'Monitor Arm', 'Webcam', 'Mechanical Switch Set', 
  'Desk Mat', 'Ergonomic Chair', 'Noise Cancelling Headphones', 'Portable SSD',
  'USB Hub', 'Smart Display', 'Tablet Stand', 'Phone Charger', 'Power Bank'
];

const CATEGORIES = [
  'Electronics', 'Accessories', 'Office', 'Audio', 'Peripherals'
];

export function generateDummyProducts(count) {
  const products = [];
  for (let i = 0; i < count; i++) {
    const randomName = PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)];
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const randomPrice = parseFloat((Math.random() * 200 + 10).toFixed(2));
    const randomStock = Math.floor(Math.random() * 500);
    
    products.push({
      name: `${randomName} ${Math.floor(Math.random() * 1000)}`,
      description: `High quality ${randomName.toLowerCase()} for daily use.`,
      price: randomPrice,
      category: randomCategory,
      stock: randomStock
    });
  }
  return products;
}
