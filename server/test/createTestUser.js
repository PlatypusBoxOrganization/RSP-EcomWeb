import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function createTestUser() {
  try {
    // Generate a unique identifier for the test user
  const uniqueId = Date.now().toString().slice(-4);
  // Ensure phone number is exactly 10 digits
  const phoneNumber = `123456${uniqueId.padStart(4, '0')}`.slice(0, 10);
  
  const testUser = {
      name: `Test User ${uniqueId}`,
      email: `testuser${uniqueId}@example.com`,
      phone: phoneNumber, // Exactly 10 digits
      password: 'password123',
      confirmPassword: 'password123'
    };
    
    console.log('Creating user with phone:', phoneNumber);

    console.log('Registering test user...');
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    
    console.log('✅ Test user created successfully');
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    // Handle different response structures
    const userData = response.data.data || response.data;
    const token = userData.token || (response.headers && response.headers.authorization);
    
    if (!token) {
      throw new Error('No token received in the response');
    }
    
    console.log('Token:', token);
    console.log('User ID:', userData._id || userData.user?._id);
    console.log('Email:', userData.email || userData.user?.email);
    
    return token;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400 && error.response.data.error.includes('already exists')) {
        console.log('ℹ️ Test user already exists. Attempting to login...');
        // Try to login instead
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email: 'test@example.com',
          password: 'password123'
        });
        
        console.log('✅ Successfully logged in test user');
        console.log('Token:', loginResponse.data.token);
        return loginResponse.data.token;
      }
      console.error('Error response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Run the function
createTestUser()
  .then(token => {
    console.log('\nYou can now use this token for testing:');
    console.log(`Bearer ${token}`);
  })
  .catch(error => {
    console.error('❌ Failed to create/login test user:', error.message);
    process.exit(1);
  });
