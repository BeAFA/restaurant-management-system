import axios from "axios";

const BASE_URL = 'http://192.168.1.164:8000/';

export const endpoints = {
    'categories': '/categories/',
    'register': '/users/',
    'login': '/o/token/',
    'current-user': '/users/current_user/',
}

export const CLIENT_ID = 'L3eugdz7Hbmtoz5NQS4foy2wE9YML1ekrnG3Wg6G';
export const CLIENT_SECRET = 'vufr8kfJ8bbzVPH82x21KYgpdi03GYItM6hGqulql9rntYHIl0102wsfpBbeCLn2Ihdq4DoBixBcmIig1kxb4o6wPILwL4pVdm1U5SKu3DfVXzAU5Xm0BHOPawQH9ydu';

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