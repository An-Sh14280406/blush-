const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('blush_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  completeOnboarding: (body) => request('/auth/onboarding', { method: 'POST', body: JSON.stringify(body) }),
  exportData: () => request('/auth/export'),
  deleteAccount: () => request('/auth/account', { method: 'DELETE' }),

  // Periods
  getPeriods: () => request('/periods'),
  createPeriod: (body) => request('/periods', { method: 'POST', body: JSON.stringify(body) }),
  updatePeriod: (id, body) => request(`/periods/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePeriod: (id) => request(`/periods/${id}`, { method: 'DELETE' }),
  getPeriodPredictions: () => request('/periods/predictions'),

  // Moods
  getMoods: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/moods${q ? `?${q}` : ''}`);
  },
  saveMood: (body) => request('/moods', { method: 'POST', body: JSON.stringify(body) }),
  deleteMood: (id) => request(`/moods/${id}`, { method: 'DELETE' }),

  // Symptoms
  getSymptoms: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/symptoms${q ? `?${q}` : ''}`);
  },
  saveSymptom: (body) => request('/symptoms', { method: 'POST', body: JSON.stringify(body) }),
  deleteSymptom: (id) => request(`/symptoms/${id}`, { method: 'DELETE' }),

  // Wellness
  getWellness: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/wellness${q ? `?${q}` : ''}`);
  },
  saveWellness: (body) => request('/wellness', { method: 'POST', body: JSON.stringify(body) }),
  deleteWellness: (id) => request(`/wellness/${id}`, { method: 'DELETE' }),

  // Analytics
  getAnalytics: (timeframe = 'all') => request(`/analytics?timeframe=${timeframe}`),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),
  createReminder: (body) => request('/notifications/reminder', { method: 'POST', body: JSON.stringify(body) }),
  deleteNotification: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
};
