import axios from "axios";

const BASE_URL = 'http://192.168.1.164:8000/';

export const endpoints = {
    'categories': '/categories/',
    'register': '/users/',
    'login': '/o/token/',
    'current-user': '/users/current_user/',
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