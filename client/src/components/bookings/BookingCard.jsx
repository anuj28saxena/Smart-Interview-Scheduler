import { useState } from 'react';
import { FiClock, FiUser } from 'react-icons/fi';
import { formatDate } from '../../utils/date';

export function BookingCard({ booking, onCancel, onReschedule, availableSlots = [], compact }) {
  const slot = booking.slot || {};
  const [newSlotId, setNewSlotId] = useState('');

  return (
    <article className="item-card">
      <div className="card-topline">
        <span className={`status-pill ${booking.status}`}>{booking.status}</span>
        {!compact && <small>{formatDate(booking.createdAt)}</small>}
      </div>
      <h3>{slot.date ? formatDate(slot.date) : 'Slot unavailable'}</h3>
      <p><FiClock /> {slot.time || 'Time pending'} - {slot.meetingMode || 'Mode pending'}</p>
      {booking.candidate && <p><FiUser /> Candidate: {booking.candidate.name}</p>}
      {booking.recruiter && <p><FiUser /> Recruiter: {booking.recruiter.name}</p>}
      {onReschedule && booking.status === 'booked' && availableSlots.length > 0 && (
        <div className="reschedule-row">
          <select value={newSlotId} onChange={(event) => setNewSlotId(event.target.value)}>
            <option value="">Choose new slot</option>
            {availableSlots.map((availableSlot) => (
              <option key={availableSlot._id} value={availableSlot._id}>
                {formatDate(availableSlot.date)} - {availableSlot.time}
              </option>
            ))}
          </select>
          <button className="neutral-button" disabled={!newSlotId} onClick={() => onReschedule(booking._id, newSlotId)}>
            Reschedule
          </button>
        </div>
      )}
      {onCancel && booking.status === 'booked' && <button className="danger-button" onClick={() => onCancel(booking._id)}>Cancel booking</button>}
    </article>
  );
}
