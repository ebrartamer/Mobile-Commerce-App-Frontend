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

// İndirimli ürünleri getir
const getDiscountedProducts = async (limit) => {
  try {
    // İndirimli ürünleri getirmek için discountPercentage parametresi kullanılıyor
    const response = await api.get(`/products?discountPercentage[gt]=0&limit=${limit}`);
    return response.data.products;
  } catch (error) {
    const message = 
      error.response?.data?.message ||
      error.message ||
      'İndirimli ürünler alınırken bir hata oluştu';
    throw new Error(message);
  }
};

// Ürün detayını getir
const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

// Kategoriye göre ürünleri getir
const getProductsByCategory = async (categoryName, params = {}) => {
    const response = await axios.get(`${API_URL}category/${categoryName}`, { params });
    return response.data;
};

// Ürün arama
const searchProducts = async (searchQuery) => {
  try {
    const response = await api.get(`/products/search?query=${encodeURIComponent(searchQuery)}`);
    return response.data;
  } catch (error) {
    const message = 
      error.response?.data?.message ||
      error.message ||
      'Ürünler aranırken bir hata oluştu';
    throw new Error(message);
  }
};

// Tüm markaları getir
const getBrands = async () => {
  try {
    const response = await api.get('/products/brands');
    return response.data;
  } catch (error) {
    const message = 
      error.response?.data?.message ||
      error.message ||
      'Markalar alınırken bir hata oluştu';
    throw new Error(message);
  }
};

// Ürüne yorum ekle
const addProductReview = async (productId, reviewData) => {
  try {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    const message = 
      error.response?.data?.message ||
      error.message ||
      'Yorum eklenirken bir hata oluştu';
    throw new Error(message);
  }
};

const productService = {
    getProducts,
    getFeaturedProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getBrands,
    addProductReview,
    getDiscountedProducts
};

export default productService;