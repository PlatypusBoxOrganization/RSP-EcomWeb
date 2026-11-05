import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { getUsers } from '../controllers/userController.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/', getUsers);

export default router;
