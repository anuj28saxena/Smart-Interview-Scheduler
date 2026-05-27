import { FiRefreshCw } from 'react-icons/fi';
import { BookingCard } from '../components/bookings/BookingCard';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { Metric } from '../components/common/Metric';
import { PageHeader } from '../components/common/PageHeader';
import { ScreenMessage } from '../components/common/ScreenMessage';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { AppShell } from '../layouts/AppShell';
import { getDashboardSummary } from '../services/bookingService';

export function DashboardPage() {
  const { user } = useAuth();
  const { data, error, loading, refresh } = useApi(getDashboardSummary);
  const dashboard = data?.dashboard;

  return (
    <AppShell>
      <PageHeader
        eyebrow={user.role === 'recruiter' ? 'Recruiter dashboard' : 'Candidate dashboard'}
        title={`Good to see you, ${user.name}`}
        action={<button className="icon-button" onClick={refresh} title="Refresh"><FiRefreshCw /></button>}
      />
      {loading && <ScreenMessage title="Loading dashboard" />}
      {error && <ErrorBanner message={error} />}
      {dashboard && user.role === 'recruiter' && (
        <div className="metric-grid">
          <Metric label="Total interviews" value={dashboard.totalInterviews} />
          <Metric label="Upcoming interviews" value={dashboard.upcomingInterviews} />
          <Metric label="Cancelled" value={dashboard.cancelledInterviews} />
          <Metric label="Available slots" value={dashboard.availableSlots} />
        </div>
      )}
      {dashboard && user.role === 'candidate' && (
        <section className="content-band">
          <h2>Upcoming interview</h2>
          {dashboard.upcomingInterview ? (
            <BookingCard booking={dashboard.upcomingInterview} compact />
          ) : (
            <EmptyState title="No upcoming interview" message="Book an available slot when you are ready." />
          )}
          <h2>Past interviews</h2>
          <div className="card-grid">
            {dashboard.pastInterviews?.map((booking) => <BookingCard key={booking._id} booking={booking} compact />)}
          </div>
        </section>
      )}
    </AppShell>
  );
}
