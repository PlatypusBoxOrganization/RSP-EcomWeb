import { expect } from 'chai';
import axios from 'axios';
import { describe, it, before, after } from 'mocha';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import sinon from 'sinon';

// Set test timeout
const TEST_TIMEOUT = 15000;
const API_URL = 'http://localhost:5000/api';

// Mock Razorpay
class MockRazorpay {
  constructor() {
    this.orders = {
      create: sinon.stub().resolves({
        id: 'order_test_123',
        amount: 1000,
        currency: 'INR',
        status: 'created'
      })
    };
    this.payments = {
      fetch: sinon.stub().resolves({
        id: 'pay_test_123',
        order_id: 'order_test_123',
        amount: 1000,
        currency: 'INR',
        status: 'captured'
      })
    };
  }
}

describe('Payment API Tests', function() {
  this.timeout(TEST_TIMEOUT);

  let authToken;
  let razorpayStub;

  before(async () => {
    // Create a test user and get auth token
    const uniqueId = Date.now().toString().slice(-4);
    const testUser = {
      name: `Test User ${uniqueId}`,
      email: `testuser${uniqueId}@example.com`,
      phone: `123456${uniqueId}`.slice(0, 10),
      password: 'password123',
      confirmPassword: 'password123'
    };

    try {
      await axios.post(`${API_URL}/auth/register`, testUser);
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      authToken = loginRes.data.token;

      // Stub Razorpay constructor to return our mock
      razorpayStub = sinon.stub().callsFake(() => new MockRazorpay());
      sinon.stub(global, 'Razorpay').value(razorpayStub);
    } catch (error) {
      console.error('Setup failed:', error.message);
      throw error;
    }
  });

  after(() => {
    // Restore stubs
    if (razorpayStub) razorpayStub.restore();
  });

  describe('POST /payments/create-order', () => {
    it('should create a new Razorpay order', async () => {
      const orderData = {
        amount: 1000, // 1000 paise = ₹10
        currency: 'INR'
      };

      const response = await axios.post(
        `${API_URL}/payments/create-order`,
        orderData,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('id');
      expect(response.data).to.have.property('amount', 1000);
      expect(response.data).to.have.property('currency', 'INR');
      expect(razorpayStub().orders.create.calledOnce).to.be.true;
    });

    it('should return 400 for invalid amount', async () => {
      try {
        await axios.post(
          `${API_URL}/payments/create-order`,
          { amount: -100 },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        throw new Error('Should have failed with 400');
      } catch (error) {
        expect(error.response.status).to.equal(400);
      }
    });
  });

  describe('POST /payments/verify', () => {
    it('should verify a payment', async () => {
      const paymentData = {
        razorpay_payment_id: 'pay_test_123',
        razorpay_order_id: 'order_test_123',
        razorpay_signature: 'test_signature_123'
      };

      const response = await axios.post(
        `${API_URL}/payments/verify`,
        paymentData,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('success', true);
      expect(razorpayStub().payments.fetch.calledOnce).to.be.true;
    });

    it('should return 400 for invalid payment data', async () => {
      try {
        await axios.post(
          `${API_URL}/payments/verify`,
          {},
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        throw new Error('Should have failed with 400');
      } catch (error) {
        expect(error.response.status).to.equal(400);
      }
    });
  });
});
