import axios from 'axios';
import api from '../../../services/api';

const API_URL = 'http://localhost:5000/api/users/address';

// Adresleri getir
const getAddresses = async () => {
    try {
        const response = await api.get('/users/profile');
        return response.data.addresses || [];
    } catch (error) {
        const message = 
            error.response?.data?.message ||
            error.message ||
            'Adresler alınırken bir hata oluştu';
        throw new Error(message);
    }
};

// Adres ekle
const addAddress = async (addressData) => {
    try {
        const response = await api.post(API_URL, addressData);
        return response.data;
    } catch (error) {
        const message = 
            error.response?.data?.message ||
            error.message ||
            'Adres eklenirken bir hata oluştu';
        throw new Error(message);
    }
};

// Adres güncelle
const updateAddress = async ({ addressId, addressData }) => {
    try {
        const response = await api.put(`${API_URL}/${addressId}`, addressData);
        return response.data;
    } catch (error) {
        const message = 
            error.response?.data?.message ||
            error.message ||
            'Adres güncellenirken bir hata oluştu';
        throw new Error(message);
    }
};

// Adres sil
const deleteAddress = async (addressId) => {
    try {
        const response = await api.delete(`${API_URL}/${addressId}`);
        return { id: addressId, ...response.data };
    } catch (error) {
        const message = 
            error.response?.data?.message ||
            error.message ||
            'Adres silinirken bir hata oluştu';
        throw new Error(message);
    }
};

const addressService = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress
};

export default addressService; 