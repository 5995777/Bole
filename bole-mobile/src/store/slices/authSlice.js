import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../api/apiService';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      console.log('Login attempt with credentials:', { username, password });
      const response = await authAPI.login({ username, password });
      console.log('Login response:', response.data);
      // Store token and user in AsyncStorage
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
      if (response.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
        request: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      return rejectWithValue(error.response?.data || { 
        message: error.message,
        requestDetails: {
          url: error.config?.url,
          method: error.config?.method
        }
      });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
  return null;
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
  const token = await AsyncStorage.getItem('token');
  const user = await AsyncStorage.getItem('user');
  
  if (token && user) {
    return { token, user: JSON.parse(user) };
  }
  return null;
});

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // Update user in AsyncStorage
      AsyncStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || action.payload; // 修复user状态更新
        state.token = action.payload.token;
        console.log('Login success:', {
          user: state.user,
          token: action.payload.token,
          isAuthenticated: true
        });
      })
      .addCase(login.rejected, (state, action) => {
        console.log('Login rejected with payload:', action.payload);
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Registration failed';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Check Auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      });
  },
});

export const { clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;