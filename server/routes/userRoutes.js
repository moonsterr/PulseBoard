import express from 'express';
import {
  register,
  login,
  logout,
  getUserInfo,
  queryUsers,
  addAuthorizedUser,
  getAuthorizedBy,
  getAuthorizedUsers,
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import passport from 'passport';
import { googleCallback } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', authMiddleware, async (req, res) => {
  return res.status(200).send({ success: true, data: req.user });
});
router.get('/getuser', authMiddleware, getUserInfo);
router.post('/logout', logout);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  googleCallback
);
router.get('/queryusers', authMiddleware, queryUsers);
router.post('/addAuthorized', authMiddleware, addAuthorizedUser);
router.get('/checkAuthorized', authMiddleware, getAuthorizedBy);
router.get('/authorized', authMiddleware, getAuthorizedUsers);

export default router;
