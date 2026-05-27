import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const notificationRouter = Router();

notificationRouter.use(protect);

notificationRouter.get('/', notificationController.getMyNotifications);
notificationRouter.patch('/:id/read', notificationController.markNotificationRead);

export default notificationRouter;
