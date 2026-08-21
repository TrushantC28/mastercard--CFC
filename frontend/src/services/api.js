const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('token');
  if (token && token !== 'undefined') {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error?.message || data.error || 'Something went wrong');
  }

  return data;
};

export const authApi = {
  login: async (credentials) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    // Handle ApiResponse format wrapper ({ success, data: { token, user } })
    const token = res.data?.token || res.token || res.data?.accessToken;
    const user = res.data?.user || res.user;
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },
  register: async (userData) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return res.data || res;
  },
};

export const activityApi = {
  getActivities: () => request('/activities'),
  getActivityById: (id) => request(`/activities/${id}`),
};

export const feedbackApi = {
  submitFeedback: (activityId, payload) =>
    request(`/activities/${activityId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getFeedback: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/feedback${query ? `?${query}` : ''}`);
  },
  exportCSV: async (params = {}) => {
    const token = localStorage.getItem('token');
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/feedback/export${query ? `?${query}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to export feedback CSV');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Feedback_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },
};

export const aiInsightApi = {
  getInsights: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/ai-insights${query ? `?${query}` : ''}`);
  },
  reviewInsight: (id, payload) =>
    request(`/ai-insights/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};
