import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 创建API实例
const API = axios.create({
  // 在Android模拟器中，10.0.2.2指向主机的localhost
  // 在iOS模拟器中，localhost指向主机的localhost
  // 在真机上，需要使用实际的服务器地址
  baseURL: Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api'
    : Platform.OS === 'ios'
      ? 'http://172.20.10.2:8080/api'
      : 'http://192.168.1.100:8080/api', // 请将192.168.1.100替换为你的电脑在局域网中的实际IP地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证令牌
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

// 响应拦截器 - 处理错误
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理401未授权错误
    if (error.response && error.response.status === 401) {
      // 清除本地存储的令牌
      AsyncStorage.removeItem('token');
      // 可以在这里添加重定向到登录页面的逻辑
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  logout: () => API.post('/auth/logout'),
  resetPassword: (email) => API.post('/auth/reset-password', { email }),
};

// 用户相关API
export const userAPI = {
  getCurrentUser: () => API.get('/users/me'),
  updateProfile: (userData) => API.put('/users/me', userData),
  getAllUsers: (params) => API.get('/users', { params }),
};

// 职位相关API
export const jobAPI = {
  getAllJobs: (params) => API.get('/jobs', { params }),
  getJobById: (id) => API.get(`/jobs/${id}`),
  createJob: (jobData) => API.post('/jobs', jobData),
  updateJob: (id, jobData) => API.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => API.delete(`/jobs/${id}`),
  applyForJob: (jobId, application) => API.post(`/jobs/${jobId}/apply`, application),
};

// 申请相关API
export const applicationAPI = {
  getAllApplications: (params) => API.get('/applications', { params }),
  getApplicationById: (id) => API.get(`/applications/${id}`),
  createApplication: (application) => API.post('/applications', application),
  updateApplicationStatus: (id, status) => API.put(`/applications/${id}/status`, { status }),
};

// 聊天相关API
export const chatAPI = {
  getConversations: () => API.get('/chats/conversations'),
  getMessages: (conversationId) => API.get(`/chats/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, content, type = 'TEXT') => 
    API.post(`/chats/conversations/${conversationId}/messages`, { content, type }),
  createConversation: (recipientId) => API.post('/chats/conversations', { recipientId }),
};

// 公司相关API
export const companyAPI = {
  getCompanyById: (id) => API.get(`/companies/${id}`),
  updateCompany: (id, companyData) => API.put(`/companies/${id}`, companyData),
  createCompany: (companyData) => API.post('/companies', companyData),
};

// 简历相关API
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