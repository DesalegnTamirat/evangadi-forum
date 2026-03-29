import express from 'express';
import { getNotifications, markAsRead } from '../controller/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/all', authMiddleware, getNotifications);
router.patch('/read/:id', authMiddleware, markAsRead);

export default router;
