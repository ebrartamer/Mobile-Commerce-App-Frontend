import axios from 'axios';
import { getAccessToken } from '../../../utils/storage';

const API_URL = 'http://localhost:5000/api/favorites';

// Favori ürünleri getir
const getFavorites = async () => {
    const token = await getAccessToken();
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

// Ürünü favorilere ekle
const addToFavorites = async (productId) => {
    const token = await getAccessToken();
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL, { productId }, config);
    return response.data;
};

// Ürünü favorilerden çıkar
const removeFromFavorites = async (productId) => {
    const token = await getAccessToken();
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.delete(`${API_URL}/${productId}`, config);
    return response.data;
};

// Ürünün favori durumunu kontrol et
const checkFavoriteStatus = async (productId) => {
    const token = await getAccessToken();
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(`${API_URL}/${productId}/check`, config);
    return response.data;
};

const favoritesService = {
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    checkFavoriteStatus
};

export default favoritesService;

