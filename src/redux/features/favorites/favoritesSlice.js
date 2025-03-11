import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import favoritesService from './favoritesService';

const initialState = {
    favorites: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

// Favori ürünleri getir
export const getFavorites = createAsyncThunk(
    'favorites/getAll',
    async (_, thunkAPI) => {
        try {
            return await favoritesService.getFavorites();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Ürünü favorilere ekle
export const addToFavorites = createAsyncThunk(
    'favorites/add',
    async (productId, thunkAPI) => {
        try {
            return await favoritesService.addToFavorites(productId);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Ürünü favorilerden çıkar
export const removeFromFavorites = createAsyncThunk(
    'favorites/remove',
    async (productId, thunkAPI) => {
        try {
            return await favoritesService.removeFromFavorites(productId);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Ürünün favori durumunu kontrol et
export const checkFavoriteStatus = createAsyncThunk(
    'favorites/check',
    async (productId, thunkAPI) => {
        try {
            return await favoritesService.checkFavoriteStatus(productId);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // getFavorites
            .addCase(getFavorites.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getFavorites.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.favorites = action.payload;
            })
            .addCase(getFavorites.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // addToFavorites
            .addCase(addToFavorites.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToFavorites.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.favorites = action.payload.favorites;
                state.message = action.payload.message;
            })
            .addCase(addToFavorites.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // removeFromFavorites
            .addCase(removeFromFavorites.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(removeFromFavorites.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.favorites = action.payload.favorites;
                state.message = action.payload.message;
            })
            .addCase(removeFromFavorites.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // checkFavoriteStatus
            .addCase(checkFavoriteStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkFavoriteStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(checkFavoriteStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = favoritesSlice.actions;
export default favoritesSlice.reducer;
