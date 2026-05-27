import mongoose from 'mongoose';

const interviewSlotSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: 1
  },
  meetingMode: {
    type: String,
    enum: ['online', 'offline', 'phone'],
    required: [true, 'Meeting mode is required']
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'cancelled'],
    default: 'available'
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

interviewSlotSchema.index({ recruiter: 1, date: 1, time: 1 });
interviewSlotSchema.index({ status: 1, date: 1 });

const InterviewSlot = mongoose.model('InterviewSlot', interviewSlotSchema);

export default InterviewSlot;
