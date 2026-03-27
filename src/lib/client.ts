import axios from 'axios';

export const AuthClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://prodapi.salesbot.cloud',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ApiClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://prodapi.salesbot.cloud',
    headers: {
        'Content-Type': 'application/json',
    },
});
