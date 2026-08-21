const BASE_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('token');
  if (token && token !== 'undefined') {
    headers.Authorization = `Bearer ${token}`;
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, {
    credentials: options.credentials || 'include',
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
  login: async (credentials) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const authData = res?.data || res;
    const token = authData?.token || res?.token || authData?.accessToken;
    const user = authData?.user || res?.user;
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
  getMe: () => request('/users/me'),
  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const activityApi = {
  getActivities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/activities${query ? `?${query}` : ''}`);
  },
  getActivityById: (id) => request(`/activities/${id}`),
  createActivity: (payload) =>
    request('/activities', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateStatus: (id, status) =>
    request(`/activities/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

export const proposalApi = {
  getProposals: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/proposals${query ? `?${query}` : ''}`);
  },
  createProposal: (payload) =>
    request('/proposals', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  approveProposal: (id, payload = {}) =>
    request(`/proposals/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  rejectProposal: (id, payload = {}) =>
    request(`/proposals/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};

export const registrationApi = {
  registerForActivity: (activityId) =>
    request(`/activities/${activityId}/register`, {
      method: 'POST',
    }),
  getActivityRegistrations: (activityId) =>
    request(`/activities/${activityId}/registrations`),
  getMyRegistrations: (userId = 'me') =>
    request(`/users/${userId}/registrations`),
  markAttendance: (registrationId, status) =>
    request(`/registrations/${registrationId}/attendance`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
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
  getAnalytics: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/feedback/analytics${query ? `?${query}` : ''}`);
  },
  exportCSV: async (params = {}) => {
    const token = localStorage.getItem('token');
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/feedback/export${query ? `?${query}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
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

export const userApi = {
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/users${query ? `?${query}` : ''}`);
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
