import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AuthPage({ mode }) {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    emailOrUsername: '',
    password: '',
    role: 'candidate'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  if (user) return <Navigate to="/" replace />;

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role
        });
      } else {
        await login({
          emailOrUsername: form.emailOrUsername,
          password: form.password
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div>
          <p className="eyebrow">Smart Interview Scheduler</p>
          <h1>{isRegister ? 'Create your workspace access' : 'Welcome back'}</h1>
          <p className="muted">Manage interview slots, bookings, and candidate updates from one secure flow.</p>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label>Name<input name="name" value={form.name} onChange={updateField} required /></label>
              <label>Username<input name="username" value={form.username} onChange={updateField} required /></label>
              <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required /></label>
              <label>Role
                <select name="role" value={form.role} onChange={updateField}>
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </label>
            </>
          )}

          {!isRegister && (
            <label>Email or username
              <input name="emailOrUsername" value={form.emailOrUsername} onChange={updateField} required />
            </label>
          )}

          <label>Password
            <input name="password" type="password" value={form.password} onChange={updateField} required />
          </label>

          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'New here?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Register'}</Link>
        </p>
      </section>
    </main>
  );
}
