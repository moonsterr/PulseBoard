import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createBoard,
  getCanvases,
  authorizeUser,
  deleteCanvas,
} from '../controllers/canvasController.js';

const router = express.Router();

router.post('/createboard', authMiddleware, createBoard);
router.get('/canvases', authMiddleware, getCanvases);
router.post('/canvas/verify', authMiddleware, authorizeUser);
router.delete('/canvas/:id', authMiddleware, deleteCanvas);

export default router;
