import axios from 'axios';
import api from '../../../services/api';

const API_URL = 'http://localhost:5000/api/cart/';

// Sepeti getir
const getCart = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

// Sepete ürün ekle
const addToCart = async (productData) => {
    const response = await api.post(API_URL, productData);
    return response.data;
};

// Sepetten ürün çıkar
const removeFromCart = async (itemId) => {
    const response = await api.delete(`${API_URL}${itemId}`);
    return response.data;
};

// Sepetteki ürün miktarını güncelle
const updateCartItem = async (itemId, quantity) => {
    const response = await api.put(`${API_URL}${itemId}`, { quantity });
    return response.data;
};

// Sepeti temizle
const clearCart = async () => {
    const response = await api.delete(API_URL);
    return response.data;
};

const cartService = {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart
};

export default cartService; 