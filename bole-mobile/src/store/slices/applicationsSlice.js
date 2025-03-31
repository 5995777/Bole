import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationAPI } from '../../api/apiService';

// Async thunks
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const response = await applicationAPI.getAllApplications(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchApplicationById = createAsyncThunk(
  'applications/fetchApplicationById',
  async (applicationId, { rejectWithValue, getState }) => {
    try {
      const response = await applicationAPI.getApplicationById(applicationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createApplication = createAsyncThunk(
  'applications/createApplication',
  async ({ jobId, coverLetter }, { rejectWithValue, getState }) => {
    try {
      const response = await applicationAPI.createApplication({ jobId, coverLetter });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateApplicationStatus',
  async ({ applicationId, status }, { rejectWithValue, getState }) => {
    try {
      const response = await applicationAPI.updateApplicationStatus(applicationId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearApplicationError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to fetch applications';
      })
      // Fetch Application By Id
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to fetch application';
      })
      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload);
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to create application';
      })
      // Update Application Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
        const index = state.applications.findIndex((app) => app.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to update application status';
      });
  },
});

export const { clearApplicationError, clearCurrentApplication } = applicationsSlice.actions;
export default applicationsSlice.reducer;