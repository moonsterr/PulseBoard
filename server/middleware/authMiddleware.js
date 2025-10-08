import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send({ success: false, data: 'token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).send({ success: false, data: 'token' });
  }
};

export default authMiddleware;
