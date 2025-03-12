import api from '../../../services/api';
import { storeTokens, storeUserData, clearUserData } from '../../../utils/storage';

// Kullanıcı girişi
const login = async (userData) => {
  try {
    const response = await api.post('/users/login', userData);
    
    if (response.data) {
      // Token'ları kaydet
      await storeTokens(response.data.accessToken, response.data.refreshToken);
      
      // Kullanıcı bilgilerini kaydet
      const user = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber || '',
      };
      await storeUserData(user);
      
      return {
        user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    }
    
    return null;
  } catch (error) {
    const message = 
      error.response?.data?.message ||
      error.message ||
      'Giriş yapılırken bir hata oluştu';
    throw new Error(message);
  }
};

// Kullanıcı kaydı
const register = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    const message = 
      error.response?.data?.message ||
      error.message ||
      'Kayıt olurken bir hata oluştu';
    throw new Error(message);
  }
};

// Kullanıcı çıkışı
const logout = async () => {
  try {
    await api.post('/users/logout');
    await clearUserData();
    return true;
  } catch (error) {
    console.error('Çıkış yapılırken hata oluştu:', error);
    // Hata olsa bile local verileri temizle
    await clearUserData();
    return false;
  }
};

// Kullanıcı profili getirme
const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    const message = 
      error.response?.data?.message ||
      error.message ||
      'Profil bilgileri alınırken bir hata oluştu';
    throw new Error(message);
  }
};

// Kullanıcı profili güncelleme
const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    
    // Kullanıcı bilgilerini güncelle
    if (response.data) {
      const updatedUser = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber || '',
      };
      await storeUserData(updatedUser);
      return updatedUser;
    }
    
    return response.data;
  } catch (error) {
    const message = 
      error.response?.data?.message ||
      error.message ||
      'Profil güncellenirken bir hata oluştu';
    throw new Error(message);
  }
};

const authService = {
  login,
  register,
  logout,
  getUserProfile,
  updateProfile,
};

export default authService; 