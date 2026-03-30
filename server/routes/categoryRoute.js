import express from 'express';
const router = express.Router();
import { getAllCategories, getCategoryQuestions, createCategory, joinCategory, leaveCategory } from '../controller/categoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.get('/all', authMiddleware, getAllCategories);
router.post('/create', authMiddleware, createCategory);
router.post('/:id/join', authMiddleware, joinCategory);
router.post('/:id/leave', authMiddleware, leaveCategory);
router.get('/:id/questions', getCategoryQuestions);

export default router;
