const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make API calls
const apiCall = async (endpoint: string, options: any = {}) => {
  const token = getAuthToken();
  const headers: any = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (email, password, fullName, language = 'en', theme = 'light', role = 'user') => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, language, theme, role }),
    });
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  login: async (email, password, role = 'user') => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },

  updateSettings: async (settings) => {
    return apiCall('/auth/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },

  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  changePassword: async (currentPassword, newPassword) => {
    return apiCall('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  forgotPassword: async (email) => {
    return apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (email, newPassword) => {
    return apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    });
  },
};

// Check-in API
export const checkInAPI = {
  create: async (entryType, textEntry, voiceTranscript = null) => {
    return apiCall('/check-ins', {
      method: 'POST',
      body: JSON.stringify({ entryType, textEntry, voiceTranscript }),
    });
  },

  getAll: async (limit = 10, offset = 0) => {
    return apiCall(`/check-ins?limit=${limit}&offset=${offset}`);
  },

  getById: async (id) => {
    return apiCall(`/check-ins/${id}`);
  },
};

// Dashboard API
export const dashboardAPI = {
  getMoodTrends: async (days = 7) => {
    return apiCall(`/dashboard/mood-trends?days=${days}`);
  },

  getSummary: async () => {
    return apiCall('/dashboard/summary');
  },

  getStats: async () => {
    return apiCall('/dashboard/stats');
  },
};

// Support Resources API
export const supportAPI = {
  getAll: async (category = null, language = 'en') => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('language', language);
    return apiCall(`/support?${params.toString()}`);
  },

  getById: async (id, language = 'en') => {
    return apiCall(`/support/${id}?language=${language}`);
  },
};

export default {
  authAPI,
  checkInAPI,
  dashboardAPI,
  supportAPI,
};
