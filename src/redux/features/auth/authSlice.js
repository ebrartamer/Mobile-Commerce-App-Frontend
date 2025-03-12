import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { getUserData } from '../../../utils/storage';

// Başlangıç durumu
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Kullanıcı girişi
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Kullanıcı kaydı
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Kullanıcı çıkışı
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      
      return await authService.logout();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Kullanıcı profili getirme
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, thunkAPI) => {
    try {
      return await authService.getUserProfile();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Kullanıcı profili güncelleme
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, thunkAPI) => {
    try {
      return await authService.updateProfile(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Kullanıcı durumunu kontrol etme
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, thunkAPI) => {
    try {
      const userData = await getUserData();
      if (userData) {
        return userData;
      }
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // Check Auth Status
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer; 