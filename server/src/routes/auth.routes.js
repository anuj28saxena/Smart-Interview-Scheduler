
import { Router } from 'express';
import * as authController from  '../controllers/auth.controller.js';  
import { protect } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);

// GET /api/auth/get-me

authRouter.get('/get-me', protect, authController.getMe);

// GET /api/auth/refresh-token

authRouter.get('/refresh-token', authController.refreshToken);   

export default authRouter; 
