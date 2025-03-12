import axios from 'axios';
import api from '../../../services/api';

const API_URL = 'http://localhost:5000/api/addresses/';

// Adresleri getir
const getAddresses = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

// Adres ekle
const addAddress = async (addressData) => {
    const response = await api.post(API_URL, addressData);
    return response.data;
};

// Adres güncelle
const updateAddress = async (addressId, addressData) => {
    const response = await api.put(`${API_URL}${addressId}`, addressData);
    return response.data;
};

// Adres sil
const deleteAddress = async (addressId) => {
    const response = await api.delete(`${API_URL}${addressId}`);
    return response.data;
};

const addressService = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress
};

export default addressService; 