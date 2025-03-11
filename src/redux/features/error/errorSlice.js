import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    message: null,
    type: null, // 'error', 'warning', 'success', 'info'
    isVisible: false
};

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        showError: (state, action) => {
            state.message = action.payload.message;
            state.type = 'error';
            state.isVisible = true;
        },
        showWarning: (state, action) => {
            state.message = action.payload.message;
            state.type = 'warning';
            state.isVisible = true;
        },
        showSuccess: (state, action) => {
            state.message = action.payload.message;
            state.type = 'success';
            state.isVisible = true;
        },
        showInfo: (state, action) => {
            state.message = action.payload.message;
            state.type = 'info';
            state.isVisible = true;
        },
        hideNotification: (state) => {
            state.message = null;
            state.type = null;
            state.isVisible = false;
        }
    }
});

export const { showError, showWarning, showSuccess, showInfo, hideNotification } = errorSlice.actions;
export default errorSlice.reducer; 