import express from 'express';
import { check } from 'express-validator';
import { 
  getUserProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserOrders,
  getOrder
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/me', getUserProfile);

// @route   PUT /api/profile/update
// @desc    Update user profile
// @access  Private
router.put(
  '/update',
  [
    check('name', 'Name is required').not().isEmpty().optional(),
    check('phone', 'Please include a valid 10-digit phone number')
      .isLength({ min: 10, max: 10 })
      .optional(),
  ],
  updateProfile
);

// @route   POST /api/profile/addresses
// @desc    Add new address
// @access  Private
router.post(
  '/addresses',
  [
    check('name', 'Address name is required').not().isEmpty(),
    check('street', 'Street address is required').not().isEmpty(),
    check('city', 'City is required').not().isEmpty(),
    check('state', 'State is required').not().isEmpty(),
    check('postalCode', 'Please include a valid 6-digit postal code')
      .isLength({ min: 6, max: 6 })
      .matches(/^[0-9]+$/),
  ],
  addAddress
);

// @route   PUT /api/profile/addresses/:addressId
// @desc    Update address
// @access  Private
router.put(
  '/addresses/:addressId',
  [
    check('postalCode', 'Please include a valid 6-digit postal code')
      .optional()
      .isLength({ min: 6, max: 6 })
      .matches(/^[0-9]+$/),
  ],
  updateAddress
);

// @route   DELETE /api/profile/addresses/:addressId
// @desc    Delete address
// @access  Private
router.delete('/addresses/:addressId', deleteAddress);

// @route   GET /api/profile/orders
// @desc    Get user orders
// @access  Private
router.get('/orders', getUserOrders);

// @route   GET /api/profile/orders/:orderId
// @desc    Get single order
// @access  Private
router.get('/orders/:orderId', getOrder);

export default router;
