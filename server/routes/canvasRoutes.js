import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createBoard,
  getCanvases,
  authorizeUser,
  getElements,
  deleteCanvasController,
  handleGetCollections,
  handleCreateCollection,
  deleteCollectionController,
  renameCanvasController,
  renameCollectionController,
} from '../controllers/canvasController.js';

const router = express.Router();

router.post('/createboard', authMiddleware, createBoard);
router.get('/canvases', authMiddleware, getCanvases);
router.post('/canvas/verify', authMiddleware, authorizeUser);
router.delete('/canvas/:id', authMiddleware, deleteCanvasController);
router.post('/createcollection', authMiddleware, handleCreateCollection);
router.get('/getcollections', authMiddleware, handleGetCollections);
router.get('/:canvasId', getElements);

router.delete('/collection/:id', authMiddleware, deleteCollectionController);
router.put('/canvas/:id', authMiddleware, renameCanvasController);
router.put('/collection/:id', authMiddleware, renameCollectionController);
export default router;
