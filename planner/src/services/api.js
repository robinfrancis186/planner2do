const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://planner2do-api.onrender.com/api'  // Replace with your actual production API URL
  : 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  TASKS: {
    BASE: `${API_BASE_URL}/tasks`,
    UPLOAD: `${API_BASE_URL}/tasks/upload`,
    DOWNLOAD: (fileName) => `${API_BASE_URL}/tasks/download/${fileName}`,
  },
  PAGES: {
    BASE: `${API_BASE_URL}/pages`,
  },
};

export const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getMultipartHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}; 