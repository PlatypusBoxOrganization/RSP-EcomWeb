import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Public routes (if any)

// Protected routes (require authentication)
router.use(protect);

// User order routes
router.route('/myorders').get(getMyOrders);
router.route('/').post(createOrder);
router.route('/:id').get(getOrderById);
router.route('/:id/pay').put(updateOrderToPaid);
router.route('/:id/cancel').put(cancelOrder);

// Admin routes (require admin privileges)
router.use(admin);

router.route('/').get(getOrders);
router.route('/:id/status').put(updateOrderStatus);
router.route('/:id/deliver').put(updateOrderToDelivered);

export default router;
