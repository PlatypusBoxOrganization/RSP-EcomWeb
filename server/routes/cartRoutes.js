import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  validateCart
} from '../controllers/cartController.js';

const router = express.Router();

// Protect all routes with authentication
router.use(protect);

// POST /api/cart - Add item to cart
router.post('/', addToCart);

// GET /api/cart - Get user's cart
router.get('/', getCart);

// PUT /api/cart/:itemId - Update cart item quantity
router.put('/:itemId', updateCartItem);

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', removeFromCart);

// DELETE /api/cart - Clear cart
router.delete('/', clearCart);

// GET /api/cart/validate - Validate cart items before checkout
router.get('/validate', validateCart);

export default router;
