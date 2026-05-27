import InterviewSlot from '../models/interviewSlot.model.js';

export async function createSlot(req, res) {
  try {
    const { date, time, duration, meetingMode, notes } = req.body;

    if (!date || !time || !duration || !meetingMode) {
      return res.status(400).json({ message: 'Date, time, duration and meeting mode are required' });
    }

    const slot = await InterviewSlot.create({
      recruiter: req.user._id,
      date,
      time,
      duration,
      meetingMode,
      notes
    });

    res.status(201).json({ message: 'Slot created successfully', slot });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSlots(req, res) {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (req.user.role === 'candidate') {
      filter.status = 'available';
    } else {
      filter.recruiter = req.user._id;
      if (status) filter.status = status;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const slots = await InterviewSlot.find(filter)
      .populate('bookedBy', 'name email username')
      .sort({ date: 1, time: 1 });

    res.status(200).json({ message: 'Slots fetched successfully', slots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateSlot(req, res) {
  try {
    const allowedFields = ['date', 'time', 'duration', 'meetingMode', 'notes'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const slot = await InterviewSlot.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.status(200).json({ message: 'Slot updated successfully', slot });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteSlot(req, res) {
  try {
    const slot = await InterviewSlot.findOne({ _id: req.params.id, recruiter: req.user._id });

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.status === 'booked') {
      return res.status(400).json({ message: 'Booked slots cannot be deleted. Cancel the booking first.' });
    }

    await slot.deleteOne();

    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
