import { FiBell } from 'react-icons/fi';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { PageHeader } from '../components/common/PageHeader';
import { ScreenMessage } from '../components/common/ScreenMessage';
import { useApi } from '../hooks/useApi';
import { AppShell } from '../layouts/AppShell';
import { getNotifications, markNotificationRead } from '../services/notificationService';
import { formatDate } from '../utils/date';

export function NotificationsPage() {
  const { data, error, loading, refresh } = useApi(getNotifications);

  async function handleMarkRead(id) {
    await markNotificationRead(id);
    refresh();
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Updates" title="Notifications" />
      {loading && <ScreenMessage title="Loading notifications" />}
      {error && <ErrorBanner message={error} />}
      <section className="notification-list">
        {data?.notifications?.map((notification) => (
          <article className={`notification ${notification.read ? 'is-read' : ''}`} key={notification._id}>
            <FiBell />
            <div>
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
              <small>{formatDate(notification.createdAt)}</small>
            </div>
            {!notification.read && <button className="ghost-button" onClick={() => handleMarkRead(notification._id)}>Mark read</button>}
          </article>
        ))}
      </section>
    </AppShell>
  );
}
