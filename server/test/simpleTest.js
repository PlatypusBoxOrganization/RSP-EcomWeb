import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    // Create a new test user
    const uniqueId = Date.now().toString().slice(-4);
    const phoneNumber = `123456${uniqueId.padStart(4, '0')}`.slice(0, 10);
    
    const testUser = {
      name: `Test User ${uniqueId}`,
      email: `testuser${uniqueId}@example.com`,
      phone: phoneNumber,
      password: 'password123',
      confirmPassword: 'password123'
    };
    
    console.log('Registering test user...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
    
    if (!registerResponse.data.token) {
      throw new Error('No token in register response');
    }
    
    return registerResponse.data.token;
  } catch (error) {
    console.error('Authentication failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test user profile endpoints
const testProfileEndpoints = async (authToken) => {
  try {
    console.log('\n--- Testing Profile Endpoints ---');
    
    // Test GET /api/profile/me
    console.log('\n1. Testing GET /api/profile/me');
    const profileResponse = await axios.get(`${API_URL}/profile/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('GET /api/profile/me - Success:', profileResponse.status === 200);
    
    // Test PUT /api/profile/update
    console.log('\n2. Testing PUT /api/profile/update');
    const updateResponse = await axios.put(
      `${API_URL}/profile/update`,
      { name: 'Updated Test User' },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('PUT /api/profile/update - Success:', updateResponse.status === 200);
    
    return true;
  } catch (error) {
    console.error('Profile test failed:', error.response?.data || error.message);
    return false;
  }
};

// Test address endpoints
const testAddressEndpoints = async (authToken) => {
  console.log('\n=== Starting Address Endpoint Tests ===');
  console.log('Auth Token:', authToken ? 'Present' : 'Missing');
  try {
    console.log('\n--- Testing Address Endpoints ---');
    
    // Test POST /api/profile/addresses
    console.log('\n1. Testing POST /api/profile/addresses');
    const newAddress = {
      name: 'Home',
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      postalCode: '123456',
      country: 'India', // Using a valid country from the schema
      isDefault: true
    };
    
    console.log('Sending address data:', JSON.stringify(newAddress, null, 2));
    
    try {
      const addResponse = await axios.post(
        `${API_URL}/profile/addresses`,
        newAddress,
        { 
          headers: { 
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          // Don't throw on non-2xx status codes
          validateStatus: () => true
        }
      );
      
      console.log('Response status:', addResponse.status);
      console.log('Response headers:', JSON.stringify(addResponse.headers, null, 2));
      console.log('Response data:', JSON.stringify(addResponse.data, null, 2));
      
      if (addResponse.status !== 201) {
        console.error('Failed to create address. Status:', addResponse.status);
        if (addResponse.data) {
          console.error('Error details:', JSON.stringify(addResponse.data, null, 2));
        }
        return false;
      }
      
      console.log('POST /api/profile/addresses - Success');
      
      // Verify the response structure
      if (!addResponse.data || !addResponse.data.success) {
        console.error('Invalid response format:', addResponse.data);
        return false;
      }
      
      // The endpoint returns the created address directly in data, not in an array
      const addressId = addResponse.data.data?._id;
      if (!addressId) {
        console.error('No address ID in response:', addResponse.data);
        return false;
      }
      
      return { success: true, addressId };
      
    } catch (error) {
      console.error('Error in address test:', error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      return { success: false };
    }
    
    // Test PUT /api/profile/addresses/:id
    console.log('\n2. Testing PUT /api/profile/addresses/:id');
    const updateResponse = await axios.put(
      `${API_URL}/profile/addresses/${addressId}`,
      { ...newAddress, city: 'Updated Test City' },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('PUT /api/profile/addresses/:id - Success:', updateResponse.status === 200);
    
    // Test DELETE /api/profile/addresses/:id
    console.log('\n3. Testing DELETE /api/profile/addresses/:id');
    const deleteResponse = await axios.delete(
      `${API_URL}/profile/addresses/${addressId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('DELETE /api/profile/addresses/:id - Success:', deleteResponse.status === 200);
    
    return true;
  } catch (error) {
    console.error('Address test failed:', error.response?.data || error.message);
    return false;
  }
};

// Test orders endpoint
const testOrdersEndpoint = async (authToken) => {
  try {
    console.log('\n--- Testing Orders Endpoint ---');
    
    // Test GET /api/profile/orders
    console.log('\n1. Testing GET /api/profile/orders');
    const ordersResponse = await axios.get(`${API_URL}/profile/orders`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('GET /api/profile/orders - Success:', ordersResponse.status === 200);
    return true;
  } catch (error) {
    console.error('Orders test failed:', error.response?.data || error.message);
    return false;
  }
};

// Main test function
const runTests = async () => {
  try {
    console.log('Starting API tests...');
    
    // Get auth token
    const authToken = await getAuthToken();
    console.log('✅ Authentication successful');
    
    // Run tests
    const profileTestsPassed = await testProfileEndpoints(authToken);
    const addressTestsPassed = await testAddressEndpoints(authToken);
    const ordersTestsPassed = await testOrdersEndpoint(authToken);
    
    // Print summary
    console.log('\n--- Test Summary ---');
    console.log(`Profile Tests: ${profileTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Address Tests: ${addressTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Orders Tests: ${ordersTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
    
    const allTestsPassed = profileTestsPassed && addressTestsPassed && ordersTestsPassed;
    console.log(`\nOverall Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    process.exit(allTestsPassed ? 0 : 1);
  } catch (error) {
    console.error('Test runner error:', error);
    process.exit(1);
  }
};

// Run the tests
runTests();
