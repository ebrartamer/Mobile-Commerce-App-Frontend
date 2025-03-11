import axios from 'axios';

const API_URL = 'http://localhost:5000/api/management/categories';

// Tüm kategorileri getir
const getCategories = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Kategori detayını getir
const getCategoryById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Yeni kategori oluştur
const createCategory = async (categoryData) => {
    const response = await axios.post(API_URL, categoryData);
    return response.data;
};

// Kategori güncelle
const updateCategory = async (id, categoryData) => {
    const response = await axios.put(`${API_URL}/${id}`, categoryData);
    return response.data;
};

// Kategori sil
const deleteCategory = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

const categoryService = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

export default categoryService; 