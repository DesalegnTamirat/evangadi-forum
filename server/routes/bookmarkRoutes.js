import express from 'express';
import { toggleBookmark, getBookmarks } from '../controller/bookmarkController.js';

const router = express.Router();

router.post('/toggle/:questionid', toggleBookmark);
router.get('/all', getBookmarks);

export default router;
