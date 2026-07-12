import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

async function deleteRecords() {
  try {
    console.log('Fetching products...');
    const response = await axios.get(`${API_BASE_URL}/products`);
    const products = response.data;
    
    console.log(`Found ${products.length} products total.`);
    
    const productsToDelete = products.slice(0, 1000);
    console.log(`Deleting ${productsToDelete.length} products...`);
    
    let deletedCount = 0;
    
    for (const product of productsToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${product._id || product.id}`);
        deletedCount++;
        if (deletedCount % 100 === 0) {
          console.log(`Deleted ${deletedCount} products so far...`);
        }
      } catch (deleteError) {
        console.error(`Failed to delete product with ID ${product._id || product.id}:`, deleteError.message);
      }
    }
    
    console.log(`Successfully deleted ${deletedCount} products.`);
  } catch (error) {
    console.error('Error fetching/deleting products:', error.message);
  }
}

deleteRecords();
