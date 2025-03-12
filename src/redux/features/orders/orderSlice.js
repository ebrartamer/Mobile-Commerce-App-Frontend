import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from './orderService';

const initialState = {
    orders: [],
    selectedOrder: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

// Sipariş oluştur
export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData, thunkAPI) => {
        try {
            return await orderService.createOrder(orderData);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Kullanıcının siparişlerini getir
export const getMyOrders = createAsyncThunk(
    'orders/getMyOrders',
    async (_, thunkAPI) => {
        try {
            return await orderService.getMyOrders();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Sipariş detayını getir
export const getOrderById = createAsyncThunk(
    'orders/getById',
    async (id, thunkAPI) => {
        try {
            return await orderService.getOrderById(id);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Siparişi iptal et
export const cancelOrder = createAsyncThunk(
    'orders/cancel',
    async (id, thunkAPI) => {
        try {
            return await orderService.cancelOrder(id);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // createOrder
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.orders.unshift(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // getMyOrders
            .addCase(getMyOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.orders = action.payload;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // getOrderById
            .addCase(getOrderById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.selectedOrder = action.payload;
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // cancelOrder
            .addCase(cancelOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.selectedOrder = action.payload;
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer; 