import Booking from '../models/booking.model.js';
import InterviewSlot from '../models/interviewSlot.model.js';
import Notification from '../models/notification.model.js';
import userModel from '../models/user.model.js';

async function createNotification(user, title, message, type) {
  await Notification.create({ user, title, message, type });
}

export async function bookSlot(req, res) {
  try {
    const { slotId } = req.body;

    if (!slotId) {
      return res.status(400).json({ message: 'Slot id is required' });
    }

    const slot = await InterviewSlot.findOneAndUpdate(
      { _id: slotId, status: 'available', bookedBy: null },
      { status: 'booked', bookedBy: req.user._id },
      { new: true }
    );

    if (!slot) {
      return res.status(409).json({ message: 'Slot is no longer available' });
    }

    const booking = await Booking.create({
      slot: slot._id,
      candidate: req.user._id,
      recruiter: slot.recruiter,
      status: 'booked'
    });

    await createNotification(
      req.user._id,
      'Booking confirmed',
      'Your interview booking has been confirmed.',
      'booking_confirmed'
    );

    res.status(201).json({ message: 'Slot booked successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMyBookings(req, res) {
  try {
    const filter = req.user.role === 'candidate'
      ? { candidate: req.user._id }
      : { recruiter: req.user._id };

    if (req.query.status) filter.status = req.query.status;

    if (req.user.role === 'recruiter' && req.query.candidateName) {
      const candidates = await userModel.find({
        role: 'candidate',
        name: { $regex: req.query.candidateName, $options: 'i' }
      }).select('_id');

      filter.candidate = { $in: candidates.map((candidate) => candidate._id) };
    }

    if (req.query.date) {
      const start = new Date(req.query.date);
      const end = new Date(req.query.date);
      end.setDate(end.getDate() + 1);

      const slotFilter = {
        date: { $gte: start, $lt: end }
      };

      if (req.user.role === 'recruiter') {
        slotFilter.recruiter = req.user._id;
      }

      const slots = await InterviewSlot.find(slotFilter).select('_id');
      filter.slot = { $in: slots.map((slot) => slot._id) };
    }

    const bookings = await Booking.find(filter)
      .populate('slot')
      .populate('candidate', 'name email username')
      .populate('recruiter', 'name email username')
      .sort({ createdAt: -1 });

    res.status(200).json({ message: 'Bookings fetched successfully', bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getDashboard(req, res) {
  try {
    if (req.user.role === 'recruiter') {
      const now = new Date();
      const [totalInterviews, cancelledInterviews, availableSlots, upcomingInterviews] = await Promise.all([
        Booking.countDocuments({ recruiter: req.user._id }),
        Booking.countDocuments({ recruiter: req.user._id, status: 'cancelled' }),
        InterviewSlot.countDocuments({ recruiter: req.user._id, status: 'available' }),
        Booking.countDocuments({ recruiter: req.user._id, status: 'booked' })
      ]);

      return res.status(200).json({
        message: 'Dashboard fetched successfully',
        dashboard: {
          totalInterviews,
          upcomingInterviews,
          cancelledInterviews,
          availableSlots,
          generatedAt: now
        }
      });
    }

    const bookings = await Booking.find({ candidate: req.user._id })
      .populate('slot')
      .sort({ createdAt: -1 });

    const now = new Date();
    const upcomingInterview = bookings.find((booking) => (
      booking.status === 'booked' &&
      booking.slot &&
      new Date(booking.slot.date) >= now
    ));

    const pastInterviews = bookings.filter((booking) => (
      booking.slot &&
      new Date(booking.slot.date) < now
    ));

    res.status(200).json({
      message: 'Dashboard fetched successfully',
      dashboard: {
        upcomingInterview: upcomingInterview || null,
        pastInterviews,
        bookingStatus: upcomingInterview?.status || 'none'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getBookingById(req, res) {
  try {
    const filter = { _id: req.params.id };

    if (req.user.role === 'candidate') {
      filter.candidate = req.user._id;
    } else {
      filter.recruiter = req.user._id;
    }

    const booking = await Booking.findOne(filter)
      .populate('slot')
      .populate('candidate', 'name email username')
      .populate('recruiter', 'name email username');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking fetched successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function cancelBooking(req, res) {
  try {
    const filter = { _id: req.params.id, status: 'booked' };

    if (req.user.role === 'candidate') {
      filter.candidate = req.user._id;
    } else {
      filter.recruiter = req.user._id;
    }

    const booking = await Booking.findOne(filter);

    if (!booking) {
      return res.status(404).json({ message: 'Active booking not found' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    await InterviewSlot.findByIdAndUpdate(booking.slot, {
      status: 'available',
      bookedBy: null
    });

    await createNotification(
      booking.candidate,
      'Interview cancelled',
      'Your interview booking has been cancelled.',
      'interview_cancelled'
    );

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function rescheduleBooking(req, res) {
  try {
    const { newSlotId } = req.body;

    if (!newSlotId) {
      return res.status(400).json({ message: 'New slot id is required' });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      candidate: req.user._id,
      status: 'booked'
    });

    if (!booking) {
      return res.status(404).json({ message: 'Active booking not found' });
    }

    const newSlot = await InterviewSlot.findOneAndUpdate(
      { _id: newSlotId, status: 'available', bookedBy: null },
      { status: 'booked', bookedBy: req.user._id },
      { new: true }
    );

    if (!newSlot) {
      return res.status(409).json({ message: 'New slot is no longer available' });
    }

    await InterviewSlot.findByIdAndUpdate(booking.slot, {
      status: 'available',
      bookedBy: null
    });

    booking.rescheduledFrom = booking.slot;
    booking.slot = newSlot._id;
    booking.recruiter = newSlot.recruiter;
    booking.status = 'booked';
    await booking.save();

    await createNotification(
      req.user._id,
      'Interview rescheduled',
      'Your interview booking has been rescheduled.',
      'interview_rescheduled'
    );

    res.status(200).json({ message: 'Booking rescheduled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
