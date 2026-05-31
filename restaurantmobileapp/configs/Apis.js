import axios from "axios";

const BASE_URL = 'http://192.168.1.157:8000';

export const endpoints = {
    
    'categories': '/categories/',
    'category_detail': (id) => `/categories/${id}/`,
    'category_foods': (id) => `/categories/${id}/foods/`,

    'ingredients': '/ingredients/',

    
    'foods': '/foods/',
    'top_dishes': '/foods/top_dishes/',
    'foods_compare': (ids) => `/foods/compare/?ids=${ids}`,
    'food_create': '/foods/create_food/',
    'food_detail': (foodId) => `/foods/${foodId}/`,
    'food_chefs': (id) => `/foods/${id}/chefs/`,
    'food_reviews': (id) => `/foods/${id}/reviews/`,

    
    'orders': '/orders/',
    'current_order': '/orders/current_order/',
    'order_detail': (id) => `/orders/${id}/`,
    'order_cancel': (id) => `/orders/${id}/cancel/`,
    'payment': (orderId) => `/orders/${orderId}/payment/`,

    
    'tables': '/tables/',

    
    'reservations': '/reservations/',
    'current_reservation': '/reservations/current_reservation/',
    'reservation_detail': (id) => `/reservations/${id}/`,
    'check_in': (id) => `/reservations/${id}/check_in/`,

    
    'current_review': (id) => `/reviews/${id}/current_review/`,
    'review_detail': (id) => `/reviews/${id}/`,

    
    'admin_stats': '/statistics/admin_stats/',
    'chef_stats': '/statistics/chef_stats/',

    
    'register': '/users/',
    'login': '/o/token/',
    'chef_list': '/users/chef_list/',
    'current_user': '/users/current_user/',
    'pending_chefs': '/users/pending_chefs/',
    'approve_chef': (id) => `/users/${id}/approve/`,
    'change_password': '/users/change_password/',

    
    
    'admin_stats': '/statistics/admin_stats/',
    'chef_stats': '/statistics/chef_stats/',
}

CLIENT_ID_REMOVED
CLIENT_SECRET_REMOVED

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