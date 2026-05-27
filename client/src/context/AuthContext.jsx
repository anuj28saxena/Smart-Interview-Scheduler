import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/authService';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [booting, setBooting] = useState(Boolean(localStorage.getItem('accessToken')));

  useEffect(() => {
    async function loadUser() {
      try {
        if (!localStorage.getItem('accessToken')) return;
        const data = await getCurrentUser();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setBooting(false);
      }
    }

    loadUser();
  }, []);

  async function login(payload) {
    const data = await loginUser(payload);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(payload) {
    const data = await registerUser(payload);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  }

  const value = useMemo(() => ({ user, booting, login, register, logout }), [user, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
