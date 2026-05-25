import axios from "axios";

const BASE_URL = 'http://192.168.1.170:8000/';

export const endpoints = {
    // === CATEGORIES ===
    'categories': '/categories/',
    'category_detail': (id) => `/categories/${id}/`,
    'category_foods': (id) => `/categories/${id}/foods/`,

    // === FOODS ===
    'foods': '/foods/',
    'foods_compare': (ids) => `/foods/compare/?ids=${ids}`,
    'top_dishes': '/foods/top_dishes/',
    'food_detail': (foodId) => `/foods/${foodId}/`,
    'food_chefs': (id) => `/foods/${id}/chefs/`,
    'food_reviews': (id) => `/foods/${id}/reviews/`,

    // === ORDERS ===
    'orders': '/orders/',
    'current_order': '/orders/current_order/',
    'order_detail': (id) => `/orders/${id}/`,
    'order_cancel': (id) => `/orders/${id}/cancel/`,
    'order_payment': (id) => `/orders/${id}/payment/`,

    // === TABLES ===
    'tables': '/tables/',

    // === RESERVATIONS (Đặt bàn) ===
    'reservations': '/reservations/',
    'current_reservation': '/reservations/current_reservation/',
    'reservation_detail': (id) => `/reservations/${id}/`,

    // === REVIEWS ===
    'current_review': (id) => `/reviews/${id}/current_review/`,
    'review_detail': (id) => `/reviews/${id}/`,

    // === STATISTICS (Thống kê) ===
    'admin_stats': '/statistics/admin_stats/',
    'chef_stats': '/statistics/chef_stats/',

    // === USERS ===
    'register': '/users/',
    'login': '/o/token/',
    'current_user': '/users/current_user/',
    'pending_chefs': '/users/pending_chefs/',
    'approve_chef': (id) => `/users/${id}/approve/`,
}

export const CLIENT_ID = 'WwE2JnPwXto3RQL9prl7JpIr5ruMay6Wh7zSazmn';
export const CLIENT_SECRET = 'uOPn4RoUMbFIzIg7s6t7Duj0idpwkz2ZnjUffI3aaoiwIZ6NvjtAxyeJQyuEKcr7NcQ7te8pAbsyThqDWS9We6aNpnVRv1wCYY1JVrRrZ31yZgP3mncVUTi4NgmaXafF';

const Apis = axios.create({
    baseURL: BASE_URL,
});

export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export default Apis;