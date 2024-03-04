import express from 'express';
import auth from '../controllers/auth/index.js';
import * as authMiddleware  from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', auth.Register);
router.post('/login', auth.Login);
router.post('/logout', auth.Logout);
router.get('/users', auth.getAllUsers);
router.get('/:user_id', auth.getUser);
router.put('/:user_id', auth.updateUser);
router.get('/user/me', authMiddleware.verifyJwt, auth.meGetUser);

export default router;