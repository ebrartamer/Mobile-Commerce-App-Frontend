import axios from 'axios';
import api from '../../../services/api';

const API_URL = 'http://localhost:5000/api/orders/';

// Sipariş oluştur
const createOrder = async (orderData) => {
    const response = await api.post(API_URL, orderData);
    return response.data;
};

// Kullanıcının siparişlerini getir
const getMyOrders = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

// Sipariş detayını getir
const getOrderById = async (id) => {
    const response = await api.get(`${API_URL}${id}`);
    return response.data;
};

// Siparişi iptal et
const cancelOrder = async (id) => {
    const response = await api.put(`${API_URL}${id}/cancel`);
    return response.data;
};

const orderService = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
};

export default orderService; 