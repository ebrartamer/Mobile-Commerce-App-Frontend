import axios from 'axios';
import api from '../../../services/api';

const API_URL = 'http://localhost:5000/api/products/';

// Tüm ürünleri getir
const getProducts = async (params) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
};

// Öne çıkan ürünleri getir
const getFeaturedProducts = async (limit) => {
    const response = await api.get(`/products/featured?limit=${limit}`);
    return response.data;
};

// Ürün detayını getir
const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

const productService = {
    getProducts,
    getFeaturedProducts,
    getProductById
};

export default productService;