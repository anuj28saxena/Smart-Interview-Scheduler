import { Navigate, useLocation } from 'react-router-dom';
import { ScreenMessage } from '../components/common/ScreenMessage';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children, role }) {
  const { user, booting } = useAuth();
  const location = useLocation();

  if (booting) return <ScreenMessage title="Loading session" message="Checking your saved login." />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}
