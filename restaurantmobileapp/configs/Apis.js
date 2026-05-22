import axios from "axios";

const BASE_URL = 'http://192.168.1.160:8000/';

export const endpoints = {
    'categories': '/categories/',
    'register': '/users/',
    'login': '/o/token/',
    'current-user': '/users/current_user/',
    'top_dishes': '/foods/top_dishes/',
    'dish_detail': (dishId) => `/foods/${dishId}/`,
    'food': (categoryId) => `/foods/?category_id=${categoryId}`,
    'tables': '/tables/',
    'current_reservation': '/reservations/current_reservation/',
    'current_reservation_create': '/reservations/current_reservation/', // Method POST
    'current_reservation_partial_update': '/reservations/current_reservation/', // Method PATCH
    'reservation_delete': (id) => `/reservations/${id}/`,
}

export const CLIENT_ID = 'P5hDvWGq9E88U4U4XfuuqfYEuiEWELYaEOrGU3wL';
export const CLIENT_SECRET = 'wvyuEeZQP9DiWtkMZHaMG3OTxhLyaWM9EYsdstwHPi7BZqlAg2TiOMCxSGuOZSlqVqtIUvGSOG5xUjnKYCfmV7fPLc4bqdIFAeLDeLF1EREo4AIpfDNHQFsUOcFToEqI';

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