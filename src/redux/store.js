import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import categoryReducer from './features/categories/categorySlice';
import productReducer from './features/products/productSlice';
import favoritesReducer from './features/favorites/favoritesSlice';
import errorReducer from './features/error/errorSlice';

// Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer,
    favorites: favoritesReducer,
    error: errorReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 