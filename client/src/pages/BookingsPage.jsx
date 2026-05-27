import { useCallback, useMemo, useState } from 'react';
import { BookingCard } from '../components/bookings/BookingCard';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { PageHeader } from '../components/common/PageHeader';
import { ScreenMessage } from '../components/common/ScreenMessage';
import { BookingFilters } from '../components/filters/BookingFilters';
import { SlotCard } from '../components/slots/SlotCard';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { AppShell } from '../layouts/AppShell';
import { bookSlot, cancelBooking, getBookings, rescheduleBooking } from '../services/bookingService';
import { getSlots } from '../services/slotService';

export function BookingsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ status: '', date: '', candidateName: '' });
  const activeFilters = useMemo(() => {
    const nextFilters = { ...filters };
    if (user.role !== 'recruiter') delete nextFilters.candidateName;
    return nextFilters;
  }, [filters, user.role]);

  const fetchBookings = useCallback(() => getBookings(activeFilters), [activeFilters]);
  const fetchAvailableSlots = useCallback(() => getSlots(), []);
  const { data, error, loading, refresh } = useApi(fetchBookings);
  const availableSlots = useApi(user.role === 'candidate' ? fetchAvailableSlots : null);
  const [message, setMessage] = useState('');

  async function handleBookSlot(slotId) {
    setMessage('');
    try {
      await bookSlot(slotId);
      setMessage('Interview booked successfully.');
      refresh();
      availableSlots.refresh();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleCancelBooking(id) {
    try {
      await cancelBooking(id);
      refresh();
      availableSlots.refresh();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleRescheduleBooking(id, newSlotId) {
    try {
      await rescheduleBooking(id, newSlotId);
      setMessage('Interview rescheduled successfully.');
      refresh();
      availableSlots.refresh();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Interview status" title={user.role === 'candidate' ? 'Your interviews' : 'Booked interviews'} />
      {user.role === 'candidate' && (
        <section className="content-band">
          <h2>Available slots</h2>
          {message && <p className="helper-text">{message}</p>}
          <div className="card-grid">
            {availableSlots.data?.slots?.map((slot) => (
              <SlotCard key={slot._id} slot={slot} onBook={handleBookSlot} />
            ))}
          </div>
        </section>
      )}

      <section className="content-band">
        <BookingFilters filters={filters} setFilters={setFilters} showCandidate={user.role === 'recruiter'} />
        {loading && <ScreenMessage title="Loading interviews" />}
        {error && <ErrorBanner message={error} />}
        <div className="card-grid">
          {data?.bookings?.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={handleCancelBooking}
              onReschedule={user.role === 'candidate' ? handleRescheduleBooking : null}
              availableSlots={availableSlots.data?.slots || []}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
