import { Router } from 'express';
import * as slotController from '../controllers/slot.controller.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';

const slotRouter = Router();

slotRouter.use(protect);

slotRouter
  .route('/')
  .get(slotController.getSlots)
  .post(authorize('recruiter'), slotController.createSlot);

slotRouter
  .route('/:id')
  .patch(authorize('recruiter'), slotController.updateSlot)
  .delete(authorize('recruiter'), slotController.deleteSlot);

export default slotRouter;
