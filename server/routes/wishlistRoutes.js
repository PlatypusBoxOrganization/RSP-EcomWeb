import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  moveToCart
} from '../controllers/wishlistController.js';

const router = express.Router();

// Protect all routes with authentication
router.use(protect);

// POST /api/wishlist - Add item to wishlist
router.post('/', addToWishlist);

// GET /api/wishlist - Get user's wishlist
router.get('/', getWishlist);

// DELETE /api/wishlist/:productId - Remove item from wishlist
router.delete('/:productId', removeFromWishlist);

// POST /api/wishlist/:productId/move-to-cart - Move item from wishlist to cart
router.post('/:productId/move-to-cart', moveToCart);

export default router;
