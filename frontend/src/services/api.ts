import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: "/api",
    timeout: 15000, // 15 giây timeout
    headers: {
        "Content-Type": "application/json",
    },
});
export default api;
