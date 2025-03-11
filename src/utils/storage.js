import AsyncStorage from '@react-native-async-storage/async-storage';

// Kullanıcı bilgilerini kaydetme
export const storeUserData = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem('user', jsonValue);
    return true;
  } catch (error) {
    console.error('Kullanıcı bilgileri kaydedilirken hata oluştu:', error);
    return false;
  }
};

// Kullanıcı bilgilerini getirme
export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Kullanıcı bilgileri alınırken hata oluştu:', error);
    return null;
  }
};

// Token'ları kaydetme
export const storeTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
    ]);
    return true;
  } catch (error) {
    console.error('Token bilgileri kaydedilirken hata oluştu:', error);
    return false;
  }
};

// Access token'ı getirme
export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem('accessToken');
  } catch (error) {
    console.error('Access token alınırken hata oluştu:', error);
    return null;
  }
};

// Refresh token'ı getirme
export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem('refreshToken');
  } catch (error) {
    console.error('Refresh token alınırken hata oluştu:', error);
    return null;
  }
};

// Kullanıcı çıkışı için tüm verileri temizleme
export const clearUserData = async () => {
  try {
    await AsyncStorage.multiRemove(['user', 'accessToken', 'refreshToken']);
    return true;
  } catch (error) {
    console.error('Kullanıcı verileri temizlenirken hata oluştu:', error);
    return false;
  }
};

// Kullanıcının giriş yapmış olup olmadığını kontrol etme
export const isUserLoggedIn = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    return !!token;
  } catch (error) {
    console.error('Kullanıcı giriş durumu kontrol edilirken hata oluştu:', error);
    return false;
  }
}; 