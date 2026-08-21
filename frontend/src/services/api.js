const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Something went wrong');
  }

  return data;
};

export const authApi = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};
