const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedBase = rawApiUrl ? rawApiUrl.replace(/\/+$|\s+$/g, '') : 'http://localhost:3000/api';
const API_BASE_URL = normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`;

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
 
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}
