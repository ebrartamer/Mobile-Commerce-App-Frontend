import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products/';

// Tüm ürünleri getir
const getProducts = async (params) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
};

// Öne çıkan ürünleri getir
const getFeaturedProducts = async (limit) => {
    const response = await axios.get(`${API_URL}featured?limit=${limit}`);
    return response.data;
};

const productService = {
    getProducts,
    getFeaturedProducts
};

export default productService;