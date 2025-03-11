import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API temel URL'i
const API_URL = 'http://localhost:5000/api';

// Axios instance oluşturma
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek gönderilmeden önce token ekleme
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Token yenileme için interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Token süresi dolmuşsa ve bu istek token yenileme isteği değilse
    if (error.response?.status === 401 && !originalRequest._retry && error.response?.data?.message?.includes('Oturum süresi doldu')) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // Refresh token yoksa kullanıcıyı çıkış yaptır
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
          return Promise.reject(error);
        }
        
        // Refresh token ile yeni token al
        const response = await axios.post(`${API_URL}/users/refresh`, { refreshToken });
        
        // Yeni token'ları kaydet
        await AsyncStorage.setItem('accessToken', response.data.accessToken);
        
        // Orijinal isteği yeni token ile tekrar gönder
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Token yenileme başarısız olursa kullanıcıyı çıkış yaptır
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 