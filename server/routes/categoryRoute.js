import express from 'express';
const router = express.Router();
import { getAllCategories, getCategoryQuestions } from '../controller/categoryController.js';

router.get('/all', getAllCategories);
router.get('/:id/questions', getCategoryQuestions);

export default router;
