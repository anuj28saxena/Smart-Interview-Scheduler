import { useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { PageHeader } from '../components/common/PageHeader';
import { ScreenMessage } from '../components/common/ScreenMessage';
import { SlotFilters } from '../components/filters/SlotFilters';
import { SlotCard } from '../components/slots/SlotCard';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { AppShell } from '../layouts/AppShell';
import { createSlot, deleteSlot, getSlots, updateSlot } from '../services/slotService';

export function SlotsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ status: '', date: '' });
  const fetchSlots = useCallback(() => getSlots(filters), [filters]);
  const { data, error, loading, refresh } = useApi(fetchSlots);
  const [form, setForm] = useState({ date: '', time: '', duration: 30, meetingMode: 'online', notes: '' });
  const [message, setMessage] = useState('');

  async function handleCreateSlot(event) {
    event.preventDefault();
    setMessage('');
    try {
      await createSlot(form);
      setForm({ date: '', time: '', duration: 30, meetingMode: 'online', notes: '' });
      setMessage('Slot created successfully.');
      refresh();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleDeleteSlot(id) {
    try {
      await deleteSlot(id);
      refresh();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleUpdateSlot(id, payload) {
    setMessage('');
    try {
      await updateSlot(id, payload);
      setMessage('Slot updated successfully.');
      refresh();
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (user.role !== 'recruiter') return <Navigate to="/" replace />;

  return (
    <AppShell>
      <PageHeader eyebrow="Slot management" title="Create and manage availability" />
      <section className="two-column">
        <form className="panel-form" onSubmit={handleCreateSlot}>
          <h2>New slot</h2>
          <label>Date<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required /></label>
          <label>Time<input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} required /></label>
          <label>Duration<input type="number" min="1" value={form.duration} onChange={(event) => setForm({ ...form, duration: Number(event.target.value) })} required /></label>
          <label>Meeting mode
            <select value={form.meetingMode} onChange={(event) => setForm({ ...form, meetingMode: event.target.value })}>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="phone">Phone</option>
            </select>
          </label>
          <label>Notes<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
          {message && <p className="helper-text">{message}</p>}
          <button className="primary-button"><FiPlus /> Create slot</button>
        </form>

        <section className="content-band">
          <SlotFilters filters={filters} setFilters={setFilters} />
          {loading && <ScreenMessage title="Loading slots" />}
          {error && <ErrorBanner message={error} />}
          <div className="card-grid">
            {data?.slots?.map((slot) => (
              <SlotCard key={slot._id} slot={slot} onDelete={handleDeleteSlot} onUpdate={handleUpdateSlot} />
            ))}
          </div>
        </section>
      </section>
    </AppShell>
  );
}
