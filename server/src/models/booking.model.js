import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSlot',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'rescheduled', 'completed'],
    default: 'booked'
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSlot',
    default: null
  }
}, { timestamps: true });

bookingSchema.index(
  { slot: 1 },
  { unique: true, partialFilterExpression: { status: 'booked' } }
);
bookingSchema.index({ candidate: 1, status: 1 });
bookingSchema.index({ recruiter: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
