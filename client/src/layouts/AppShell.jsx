import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiCalendar, FiClock, FiLogOut, FiPlus, FiUser } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

export function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/">
          <span className="brand-mark">SI</span>
          <span>
            <strong>Scheduler</strong>
            <small>{user.role}</small>
          </span>
        </Link>

        <nav className="nav-links">
          <Link to="/"><FiCalendar /> Dashboard</Link>
          <Link to="/bookings"><FiClock /> Interviews</Link>
          <Link to="/notifications"><FiBell /> Notifications</Link>
          {user.role === 'recruiter' && <Link to="/slots"><FiPlus /> Slots</Link>}
        </nav>

        <div className="profile-strip">
          <span><FiUser /></span>
          <div>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
        </div>
        <button className="ghost-button" onClick={handleLogout}><FiLogOut /> Logout</button>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
