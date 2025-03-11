import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import categoryReducer from './features/categories/categorySlice';

// Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 