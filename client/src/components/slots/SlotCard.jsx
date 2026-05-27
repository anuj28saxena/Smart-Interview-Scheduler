import { useState } from 'react';
import { FiCheckCircle, FiClock, FiUser } from 'react-icons/fi';
import { formatDate } from '../../utils/date';

export function SlotCard({ slot, onBook, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    date: slot.date ? new Date(slot.date).toISOString().slice(0, 10) : '',
    time: slot.time || '',
    duration: slot.duration || 30,
    meetingMode: slot.meetingMode || 'online',
    notes: slot.notes || ''
  });

  async function submitEdit(event) {
    event.preventDefault();
    await onUpdate(slot._id, draft);
    setEditing(false);
  }

  if (editing) {
    return (
      <article className="item-card">
        <form className="compact-form" onSubmit={submitEdit}>
          <label>Date<input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} required /></label>
          <label>Time<input type="time" value={draft.time} onChange={(event) => setDraft({ ...draft, time: event.target.value })} required /></label>
          <label>Duration<input type="number" min="1" value={draft.duration} onChange={(event) => setDraft({ ...draft, duration: Number(event.target.value) })} required /></label>
          <label>Meeting mode
            <select value={draft.meetingMode} onChange={(event) => setDraft({ ...draft, meetingMode: event.target.value })}>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="phone">Phone</option>
            </select>
          </label>
          <label>Notes<textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></label>
          <div className="button-row">
            <button className="primary-button">Save</button>
            <button className="neutral-button" type="button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article className="item-card">
      <div className="card-topline">
        <span className={`status-pill ${slot.status}`}>{slot.status}</span>
        <small>{slot.duration} min</small>
      </div>
      <h3>{formatDate(slot.date)}</h3>
      <p><FiClock /> {slot.time} - {slot.meetingMode}</p>
      {slot.bookedBy && <p><FiUser /> {slot.bookedBy.name}</p>}
      {slot.notes && <p className="muted">{slot.notes}</p>}
      {onBook && <button className="primary-button" onClick={() => onBook(slot._id)}><FiCheckCircle /> Book slot</button>}
      {onUpdate && slot.status !== 'booked' && <button className="neutral-button" onClick={() => setEditing(true)}>Edit</button>}
      {onDelete && slot.status !== 'booked' && <button className="danger-button" onClick={() => onDelete(slot._id)}>Delete</button>}
    </article>
  );
}
