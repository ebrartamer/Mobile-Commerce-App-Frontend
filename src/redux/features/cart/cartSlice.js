import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from './cartService';

const initialState = {
    cart: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

// Sepeti getir
export const getCart = createAsyncThunk(
    'cart/getCart',
    async (_, thunkAPI) => {
        try {
            return await cartService.getCart();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Sepete ürün ekle
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (productData, thunkAPI) => {
        try {
            return await cartService.addToCart(productData);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Sepetten ürün çıkar
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId, thunkAPI) => {
        try {
            return await cartService.removeFromCart(itemId);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Sepetteki ürün miktarını güncelle
export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ itemId, quantity }, thunkAPI) => {
        try {
            return await cartService.updateCartItem(itemId, quantity);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Sepeti temizle
export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, thunkAPI) => {
        try {
            return await cartService.clearCart();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // getCart
            .addCase(getCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.cart = action.payload;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // addToCart
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.cart = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // removeFromCart
            .addCase(removeFromCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.cart = action.payload;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // updateCartItem
            .addCase(updateCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.cart = action.payload;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // clearCart
            .addCase(clearCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.cart = action.payload.cart;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = cartSlice.actions;
export default cartSlice.reducer; 