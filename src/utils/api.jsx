 import axios from 'axios';
import Router from 'next/router';

class AxiosBackendApi {
    constructor() {
        this.api = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
        });

        this.api.interceptors.request.use(
            (config) => {
                if (!config.headers['Content-Type']) {
                    config.headers['Content-Type'] = 'application/json';
                }

                const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    Router.push('/login');
                }
                return Promise.reject(error);
            }
        );
    }

    getInstance() {
        return this.api;
    }
}

// Експортуємо єдиний екземпляр класу
const axiosBackendApi = new AxiosBackendApi().getInstance();
export default axiosBackendApi;
