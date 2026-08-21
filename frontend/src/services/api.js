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
    console.error(`API Error [${endpoint}]:`, data);
    
    let errorMessage = 'Something went wrong';
    if (data) {
      if (typeof data.message === 'string') {
        errorMessage = data.message;
      } else if (typeof data.error === 'string') {
        errorMessage = data.error;
      } else if (data.error && typeof data.error.message === 'string') {
        errorMessage = data.error.message;
      } else if (data.message && typeof data.message.message === 'string') {
        errorMessage = data.message.message;
      }
    }

    const error = new Error(errorMessage);
    error.response = { data, status: response.status };
    throw error;
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
