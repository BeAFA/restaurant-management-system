import axios from "axios";

const BASE_URL = 'http://192.168.1.205:8000';

export const endpoints = {
    // === CATEGORIES ===
    'categories': '/categories/',
    'category_detail': (id) => `/categories/${id}/`,
    'category_foods': (id) => `/categories/${id}/foods/`,

    // === INGREDIENTS ===
    'ingredients': '/ingredients/',

    // === FOODS ===
    'foods': '/foods/',
    'top_dishes': '/foods/top_dishes/',
    'foods_compare': (ids) => `/foods/compare/?ids=${ids}`,
    'food_create': '/foods/create_food/',
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
    'chef_list': 'users/chef_list/',
    'current_user': '/users/current_user/',
    'pending_chefs': '/users/pending_chefs/',
    'approve_chef': (id) => `/users/${id}/approve/`,
    'change_password': '/users/change_password/',

    // ADMIN
    // THÊM 3 API MỚI VÀO ĐÂY:
    'admin_stats': '/statistics/admin_stats/',
    'chef_stats': '/statistics/chef_stats/',
    
    // Dùng arrow function để truyền ID linh hoạt vào URL
    'check_in': (id) => `/statistics/${id}/check_in/`,
}

export const CLIENT_ID = '7gLtcXlozWN7XFxk8R5W6uxqV1NlACMIxsMy9gxb';
export const CLIENT_SECRET = 'Ffv3NFrWkr6ftLzPJCJZqY9yL2myke1WGKIgOSTNRCCxrcMky0sB9bU0owgPPN4RPI3xh0vZgVPESJ9697hPmQXm22AbqCBov7Arv6c3QIJnnkvQ8jwEMvq3zrhhP10v';

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