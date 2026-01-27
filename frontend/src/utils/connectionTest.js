import axios from 'axios';

// Test HTTPS connection to backend
export const testBackendConnection = async () => {
  console.log('🔍 Testing Backend Connection...');
  console.log('API URL:', import.meta.env.VITE_API_URL);
  
  const tests = [
    {
      name: 'Backend Root',
      url: 'https://localhost:5001',
    },
    {
      name: 'Backend Health',
      url: 'https://localhost:5001/api',
    },
    {
      name: 'Products Endpoint',
      url: 'https://localhost:5001/api/products',
    },
  ];

  for (const test of tests) {
    try {
      console.log(`\n📡 Testing: ${test.name}`);
      console.log(`   URL: ${test.url}`);
      
      const response = await axios.get(test.url, {
        timeout: 5000,
        withCredentials: true,
      });
      
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   ✅ Data:`, response.data);
    } catch (error) {
      console.error(`   ❌ Failed: ${test.name}`);
      console.error(`   Error: ${error.message}`);
      
      if (error.response) {
        console.error(`   Status: ${error.response.status}`);
        console.error(`   Data:`, error.response.data);
      } else if (error.request) {
        console.error(`   No response received`);
        console.error(`   This could be a CORS or SSL certificate issue`);
      }
    }
  }
  
  console.log('\n✅ Connection test complete');
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testBackendConnection = testBackendConnection;
}
