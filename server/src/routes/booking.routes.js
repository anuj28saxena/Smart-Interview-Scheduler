import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';

const bookingRouter = Router();

bookingRouter.use(protect);

bookingRouter.get('/dashboard/summary', bookingController.getDashboard);
bookingRouter.get('/', bookingController.getMyBookings);
bookingRouter.get('/:id', bookingController.getBookingById);
bookingRouter.post('/', authorize('candidate'), bookingController.bookSlot);
bookingRouter.patch('/:id/cancel', bookingController.cancelBooking);
bookingRouter.patch('/:id/reschedule', authorize('candidate'), bookingController.rescheduleBooking);

export default bookingRouter;
