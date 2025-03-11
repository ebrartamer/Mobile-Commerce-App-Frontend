import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from './categoryService';

// Başlangıç durumu
const initialState = {
    categories: [],
    selectedCategory: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// Tüm kategorileri getir
export const getCategories = createAsyncThunk(
    'categories/getAll',
    async (_, thunkAPI) => {
        try {
            return await categoryService.getCategories();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Kategori detayını getir
export const getCategoryById = createAsyncThunk(
    'categories/getById',
    async (id, thunkAPI) => {
        try {
            return await categoryService.getCategoryById(id);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Yeni kategori oluştur
export const createCategory = createAsyncThunk(
    'categories/create',
    async (categoryData, thunkAPI) => {
        try {
            return await categoryService.createCategory(categoryData);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Kategori güncelle
export const updateCategory = createAsyncThunk(
    'categories/update',
    async ({ id, categoryData }, thunkAPI) => {
        try {
            return await categoryService.updateCategory(id, categoryData);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Kategori sil
export const deleteCategory = createAsyncThunk(
    'categories/delete',
    async (id, thunkAPI) => {
        try {
            await categoryService.deleteCategory(id);
            return id;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
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
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Tüm kategorileri getir
            .addCase(getCategories.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Kategori detayını getir
            .addCase(getCategoryById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCategoryById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.selectedCategory = action.payload;
            })
            .addCase(getCategoryById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Yeni kategori oluştur
            .addCase(createCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Kategori güncelle
            .addCase(updateCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.categories.findIndex(cat => cat._id === action.payload._id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
                state.selectedCategory = action.payload;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Kategori sil
            .addCase(deleteCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.categories = state.categories.filter(category => category._id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer; 