import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import addressService from './addressService';

const initialState = {
    addresses: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
};

// Adresleri getir
export const getAddresses = createAsyncThunk(
    'addresses/getAll',
    async (_, thunkAPI) => {
        try {
            return await addressService.getAddresses();
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Adres ekle
export const addAddress = createAsyncThunk(
    'addresses/add',
    async (addressData, thunkAPI) => {
        try {
            return await addressService.addAddress(addressData);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Adres güncelle
export const updateAddress = createAsyncThunk(
    'addresses/update',
    async ({ addressId, addressData }, thunkAPI) => {
        try {
            return await addressService.updateAddress({ addressId, addressData });
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Adres sil
export const deleteAddress = createAsyncThunk(
    'addresses/delete',
    async (addressId, thunkAPI) => {
        try {
            return await addressService.deleteAddress(addressId);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const addressSlice = createSlice({
    name: 'addresses',
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
            // getAddresses
            .addCase(getAddresses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAddresses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.addresses = action.payload;
            })
            .addCase(getAddresses.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // addAddress
            .addCase(addAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.addresses = action.payload;
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // updateAddress
            .addCase(updateAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.addresses = action.payload;
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // deleteAddress
            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.addresses = state.addresses.filter(address => address._id !== action.payload.id);
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = addressSlice.actions;
export default addressSlice.reducer; 