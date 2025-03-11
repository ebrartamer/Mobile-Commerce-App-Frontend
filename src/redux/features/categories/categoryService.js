import axios from 'axios';

const API_URL = 'http://localhost:5000/api/management/categories';

// Tüm kategorileri getir
const getCategories = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Alt kategorileri getir
const getSubCategories = async (categoryId) => {
    const response = await axios.get(`${API_URL}/${categoryId}/subcategories`);
    return response.data;
};

const categoryService = {
    getCategories,
    getSubCategories,
};

export default categoryService; 