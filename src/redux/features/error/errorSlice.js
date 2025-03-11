import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    message: null,
    type: null, // 'error', 'warning', 'success', 'info'
    isVisible: false,
    shouldRedirect: false // Oturum süresi dolduğunda yönlendirme için
};

// Hata mesajlarını kullanıcı dostu hale getiren yardımcı fonksiyon
const formatErrorMessage = (error) => {
    // Oturum süresi dolma kontrolü
    if (error.includes('Oturum süresi doldu') || 
        error.includes('Token expired') || 
        error.includes('jwt expired')) {
        return {
            message: 'Oturum süreniz doldu, lütfen tekrar giriş yapın',
            shouldRedirect: true
        };
    }

    // Favori işlemleri ile ilgili hatalar
    if (error.includes('Favori durumu kontrol edilirken hata')) {
        return {
            message: 'Favori durumu kontrol edilemedi, lütfen tekrar deneyin',
            shouldRedirect: false
        };
    }

    // Yetkilendirme hataları
    if (error.includes('Unauthorized') || error.includes('401')) {
        return {
            message: 'Bu işlemi yapmak için giriş yapmanız gerekiyor',
            shouldRedirect: true
        };
    }

    // Genel ağ hataları
    if (error.includes('Network Error')) {
        return {
            message: 'İnternet bağlantınızı kontrol edip tekrar deneyin',
            shouldRedirect: false
        };
    }

    // Varsayılan hata mesajı
    return {
        message: error,
        shouldRedirect: false
    };
};

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        showError: (state, action) => {
            const formattedError = formatErrorMessage(action.payload.message);
            state.message = formattedError.message;
            state.type = 'error';
            state.isVisible = true;
            state.shouldRedirect = formattedError.shouldRedirect;
        },
        showWarning: (state, action) => {
            state.message = action.payload.message;
            state.type = 'warning';
            state.isVisible = true;
            state.shouldRedirect = false;
        },
        showSuccess: (state, action) => {
            state.message = action.payload.message;
            state.type = 'success';
            state.isVisible = true;
            state.shouldRedirect = false;
        },
        showInfo: (state, action) => {
            state.message = action.payload.message;
            state.type = 'info';
            state.isVisible = true;
            state.shouldRedirect = false;
        },
        hideNotification: (state) => {
            state.message = null;
            state.type = null;
            state.isVisible = false;
            state.shouldRedirect = false;
        }
    }
});

export const { showError, showWarning, showSuccess, showInfo, hideNotification } = errorSlice.actions;
export default errorSlice.reducer; 