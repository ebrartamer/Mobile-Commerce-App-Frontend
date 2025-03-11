import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from './categoryService';

// Başlangıç durumu
const initialState = {
    categories: [],
    subCategories: {},
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Tüm kategorileri getir
export const fetchCategories = createAsyncThunk(
    'categories/getAll',
    async (_, thunkAPI) => {
        try {
            return await categoryService.getCategories();
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Kategoriler yüklenirken bir hata oluştu';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Alt kategorileri getir
export const fetchSubCategories = createAsyncThunk(
    'categories/getSubCategories',
    async (categoryId, thunkAPI) => {
        try {
            return await categoryService.getSubCategories(categoryId);
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Alt kategoriler yüklenirken bir hata oluştu';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
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
            // Kategorileri getir
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.categories = [];
            })
            // Alt kategorileri getir
            .addCase(fetchSubCategories.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSubCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.subCategories[action.meta.arg] = action.payload;
            })
            .addCase(fetchSubCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = categorySlice.actions;
export default categorySlice.reducer; 