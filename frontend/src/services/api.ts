import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: "/api",
    timeout: 15000, // 15 giây timeout
    headers: {
        "Content-Type": "application/json",
    },
});

// ===== REQUEST INTERCEPTOR =====
// Chạy TRƯỚC khi request được gửi đi
// Tự động thêm JWT token vào mọi request
// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     // Lấy token từ localStorage
//     // ÔN LẠI: localStorage lưu key-value, persist qua session
//     const token = localStorage.getItem("access_token");

//     if (token) {
//       // Thêm header: "Authorization: Bearer eyJ..."
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// ===== RESPONSE INTERCEPTOR =====
// Chạy SAU khi nhận response
// Tự động refresh token khi nhận 401 Unauthorized
// let isRefreshing = false;
// // Queue các request đang chờ token mới
// let failedQueue: Array<{
//   resolve: (token: string) => void;
//   reject: (error: unknown) => void;
// }> = [];

// // processQueue: Retry hoặc reject tất cả request đang chờ
// const processQueue = (error: unknown, token: string | null = null) => {
//   failedQueue.forEach(({ resolve, reject }) => {
//     if (error) {
//       reject(error);
//     } else if (token) {
//       resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   // Success: Trả response bình thường
//   (response) => response,

//   // Error: Xử lý các lỗi HTTP
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     // Nếu 401 Unauthorized và chưa retry
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       // Nếu đang refresh → queue request này lại
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then((token) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return api(originalRequest);
//         });
//       }

//       // Bắt đầu refresh token
//       originalRequest._retry = true;
//       isRefreshing = true;

//       const refreshToken = localStorage.getItem("refresh_token");

//       if (!refreshToken) {
//         // Không có refresh token → logout
//         localStorage.clear();
//         window.location.href = "/login";
//         return Promise.reject(error);
//       }

//       try {
//         // Gọi API refresh token
//         const response = await axios.post("/api/auth/refresh", {
//           refresh_token: refreshToken,
//         });

//         const { access_token, refresh_token } = response.data;

//         // Lưu token mới
//         localStorage.setItem("access_token", access_token);
//         localStorage.setItem("refresh_token", refresh_token);

//         // Cập nhật header mặc định
//         api.defaults.headers.common.Authorization = `Bearer ${access_token}`;

//         // Retry tất cả request đang chờ
//         processQueue(null, access_token);

//         // Retry request gốc
//         originalRequest.headers.Authorization = `Bearer ${access_token}`;
//         return api(originalRequest);

//       } catch (refreshError) {
//         // Refresh thất bại → logout
//         processQueue(refreshError, null);
//         localStorage.clear();
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;