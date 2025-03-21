import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from './productService';

const initialState = {
    products: [],
    featuredProducts: [],
    categoryProducts: [],
    discountedProducts: [],
    selectedProduct: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    pagination: {
        page: 1,
        pages: 1,
        totalProducts: 0
    },
    brands: []
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

// Kategoriye göre ürünleri getir
export const getProductsByCategory = createAsyncThunk(
    'products/getByCategory',
    async ({ categoryName, params = {} }, thunkAPI) => {
        try {
            return await productService.getProductsByCategory(categoryName, params);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Ürün arama
export const searchProducts = createAsyncThunk(
    'products/search',
    async (searchQuery, thunkAPI) => {
        try {
            return await productService.searchProducts(searchQuery);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Markaları getir
export const getBrands = createAsyncThunk(
    'products/getBrands',
    async (_, thunkAPI) => {
        try {
            return await productService.getBrands();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Ürüne yorum ekle
export const addProductReview = createAsyncThunk(
    'products/addReview',
    async ({ productId, reviewData }, thunkAPI) => {
        try {
            return await productService.addProductReview(productId, reviewData);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// İndirimli ürünleri getir
export const getDiscountedProducts = createAsyncThunk(
    'products/getDiscounted',
    async (limit, thunkAPI) => {
        try {
            return await productService.getDiscountedProducts(limit);
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
        },
        clearCategoryProducts: (state) => {
            state.categoryProducts = [];
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
                state.pagination = {
                    page: action.payload.page,
                    pages: action.payload.pages,
                    totalProducts: action.payload.totalProducts
                };
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
            })
            // Kategoriye göre ürünler
            .addCase(getProductsByCategory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProductsByCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.categoryProducts = action.payload.products;
                state.pagination = {
                    page: action.payload.page,
                    pages: action.payload.pages,
                    totalProducts: action.payload.totalProducts
                };
            })
            .addCase(getProductsByCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Ürün arama
            .addCase(searchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = action.payload;
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Markaları getir
            .addCase(getBrands.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBrands.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.brands = action.payload;
            })
            .addCase(getBrands.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Ürüne yorum ekle
            .addCase(addProductReview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addProductReview.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(addProductReview.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // İndirimli ürünler
            .addCase(getDiscountedProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDiscountedProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.discountedProducts = action.payload;
            })
            .addCase(getDiscountedProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset, clearSelectedProduct, clearCategoryProducts } = productSlice.actions;
export default productSlice.reducer; 