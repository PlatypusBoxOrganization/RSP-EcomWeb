import axios from 'axios';

const API_URL = 'http://localhost:5000/api/test';

async function testRoutes() {
  try {
    // Test status endpoint
    console.log('Testing /status endpoint...');
    const statusRes = await axios.get(`${API_URL}/status`);
    console.log('Status response:', statusRes.data);

    // Test DB connection
    console.log('\nTesting /test-db endpoint...');
    const dbRes = await axios.get(`${API_URL}/test-db`);
    console.log('DB connection response:', dbRes.data);

  } catch (error) {
    console.error('\nTest failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error('Error setting up request:', error.message);
    }
  }
}

testRoutes();
