import { expect } from 'chai';
import axios from 'axios';
import { describe, it, before, after } from 'mocha';

// Set test timeout
const TEST_TIMEOUT = 15000;

// Configure axios to not throw on non-2xx status codes
axios.defaults.validateStatus = function (status) {
  return true; // Always resolve the promise, even for error statuses
};

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
    
    // Register the new user
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

describe('Profile API Tests', function() {
  // Increase timeout for all tests
  this.timeout(10000);
  
  let authToken;

  before(async () => {
    try {
      authToken = await getAuthToken();
      console.log('✅ Authentication successful');
    } catch (error) {
      console.error('❌ Failed to authenticate. Please check test credentials.');
      process.exit(1);
    }
  });

  describe('GET /api/profile/me', function() {
    it('should return user profile', async function() {
      const response = await axios.get(`${API_URL}/profile/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('success', true);
      expect(response.data.data).to.have.property('email');
      expect(response.data.data).to.have.property('name');
    });
  });

  describe('PUT /api/profile/update', function() {
    it('should update user profile', async function() {
      const updateData = { name: 'Test User Updated' };
      
      const response = await axios.put(
        `${API_URL}/profile/update`,
        updateData,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('success', true);
      expect(response.data.data).to.have.property('name', updateData.name);
    });
  });

  describe('Address Management', function() {
    let testAddressId;

    describe('POST /api/profile/addresses', function() {
      it('should add a new address', async function() {
        const newAddress = {
          name: 'Home',
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          postalCode: '123456', // Updated to 6 digits to match validation
          country: 'Test Country',
          isDefault: true
        };
        
        console.log('Sending address creation request...');
        try {
          const response = await axios.post(
            `${API_URL}/profile/addresses`,
            newAddress,
            { 
              headers: { 
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              },
              // Add response validation to get detailed error
              validateStatus: status => true
            }
          );
          
          console.log('Response status:', response.status);
          console.log('Response data:', JSON.stringify(response.data, null, 2));
          
          if (response.status !== 201) {
            console.error('Error details:', response.data);
            throw new Error(`Expected status 201 but got ${response.status}`);
          }
          
          expect(response.status).to.equal(201);
          expect(response.data).to.have.property('success', true);
          expect(response.data.data).to.have.property('addresses').that.is.an('array');
          
          // Save the address ID for subsequent tests
          const addedAddress = response.data.data.addresses.find(addr => addr.street === newAddress.street);
          if (!addedAddress) {
            console.error('Could not find added address in response:', response.data.data);
            throw new Error('Added address not found in response');
          }
          
          testAddressId = addedAddress._id;
          console.log('Created address with ID:', testAddressId);
          
          expect(addedAddress).to.include({
            name: newAddress.name,
            city: newAddress.city,
            isDefault: true
          });
        } catch (error) {
          console.error('Error in test:', error.message);
          if (error.response) {
            console.error('Response error data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
          }
          throw error;
        }
      });
    });

    describe('PUT /api/profile/addresses/:id', function() {
      it('should update an existing address', async function() {
        if (!testAddressId) {
          this.skip(); // Skip if no address was created in previous test
        }
        
        const updateData = {
          name: 'Work',
          street: '456 Work Ave',
          city: 'Work City',
          state: 'Work State',
          postalCode: '54321',
          country: 'Work Country',
          isDefault: false
        };
        
        const response = await axios.put(
          `${API_URL}/profile/addresses/${testAddressId}`,
          updateData,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('success', true);
        expect(response.data.data).to.include({
          _id: testAddressId,
          name: updateData.name,
          street: updateData.street,
          isDefault: updateData.isDefault
        });
      });
    });
    
    describe('DELETE /api/profile/addresses/:id', function() {
      it('should delete an address', async function() {
        if (!testAddressId) {
          this.skip(); // Skip if no address was created in previous test
        }
        
        const response = await axios.delete(
          `${API_URL}/profile/addresses/${testAddressId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('success', true);
        
        // Verify the address was actually deleted
        const getResponse = await axios.get(`${API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
        const addressExists = getResponse.data.data.addresses.some(
          addr => addr._id === testAddressId
        );
        
        expect(addressExists).to.be.false;
      });
    });
  });

  describe('GET /api/profile/orders', function() {
    it('should fetch user orders', async function() {
      const response = await axios.get(`${API_URL}/profile/orders`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('success', true);
      expect(response.data).to.have.property('data').that.is.an('array');
    });
  });
});
