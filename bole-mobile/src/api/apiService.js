import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create API instance
const API = axios.create({
  // In Android emulator, 10.0.2.2 points to the host's localhost
  // In iOS emulator, localhost points to the host's localhost
  // On a real device, you need to use the actual server address
  baseURL: Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api'
    : 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add authentication token
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error setting auth token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      // Clear locally stored token
      AsyncStorage.removeItem('token');
      // You can add logic to redirect to the login page here
    }
    return Promise.reject(error);
  }
);

// Authentication related API
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  logout: () => API.post('/auth/logout'),
  resetPassword: (email) => API.post('/auth/reset-password', { email }),
};

// User related API
export const userAPI = {
  getCurrentUser: () => API.get('/users/me'),
  updateProfile: (userData) => API.put('/users/me', userData),
  getAllUsers: (params) => API.get('/users', { params }),
};

// Job related API
export const jobAPI = {
  getAllJobs: (params) => API.get('/jobs', { params }),
  getJobById: (id) => API.get(`/jobs/${id}`),
  createJob: (jobData) => API.post('/jobs', jobData),
  updateJob: (id, jobData) => API.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => API.delete(`/jobs/${id}`),
  applyForJob: (jobId, application) => API.post(`/jobs/${jobId}/apply`, application),
};

// Application related API
export const applicationAPI = {
  getAllApplications: (params) => API.get('/applications', { params }),
  getApplicationById: (id) => API.get(`/applications/${id}`),
  createApplication: (application) => API.post('/applications', application),
  updateApplicationStatus: (id, status) => API.put(`/applications/${id}/status`, { status }),
};

// Chat related API
export const chatAPI = {
  getConversations: () => API.get('/chats/conversations'),
  getMessages: (conversationId) => API.get(`/chats/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, content, type = 'TEXT') => 
    API.post(`/chats/conversations/${conversationId}/messages`, { content, type }),
  createConversation: (recipientId) => API.post('/chats/conversations', { recipientId }),
};

// Company related API
export const companyAPI = {
  getCompanyById: (id) => API.get(`/companies/${id}`),
  updateCompany: (id, companyData) => API.put(`/companies/${id}`, companyData),
  createCompany: (companyData) => API.post('/companies', companyData),
};

// Resume related API
export const resumeAPI = {
  getResume: () => API.get('/resumes/me'),
  updateResume: (resumeData) => API.put('/resumes/me', resumeData),
  uploadResumeFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return API.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default API;