import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from './productService';

const initialState = {
    products: [],
    featuredProducts: [],
    selectedProduct: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

// Tüm ürünleri getir
export const getProducts = createAsyncThunk(
    'products/getAll',
    async (params, thunkAPI) => {
        try {
            return await productService.getProducts(params);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Öne çıkan ürünleri getir
export const getFeaturedProducts = createAsyncThunk(
    'products/getFeatured',
    async (limit, thunkAPI) => {
        try {
            return await productService.getFeaturedProducts(limit);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Ürün detayını getir
export const getProductDetails = createAsyncThunk(
    'products/getDetails',
    async (id, thunkAPI) => {
        try {
            return await productService.getProductById(id);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // getProducts
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = action.payload.products;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // getFeaturedProducts
            .addCase(getFeaturedProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getFeaturedProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.featuredProducts = action.payload;
            })
            .addCase(getFeaturedProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Ürün detayı
            .addCase(getProductDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.selectedProduct = action.payload;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer; 