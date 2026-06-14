import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

apiClient.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {

        const originalRequest = error.config as RetryableRequestConfig;

        const isUnauthorized = error?.response?.status === 401;
        const hasNotRetried = originalRequest && !originalRequest._retry;
        const isAuthRoute = originalRequest?.url?.includes("/api/auth/login") ||
            originalRequest?.url?.includes("/api/auth/register") ||
            originalRequest?.url?.includes("/api/auth/refresh");

        if (isUnauthorized && hasNotRetried && !isAuthRoute) {
            originalRequest._retry = true;

            try {

                await apiClient.post("/api/auth/refresh");
                return apiClient(originalRequest);

            }
            catch (refreshError) {
                return Promise.reject(refreshError)

            }
        }
        return Promise.reject(error);

    }
);
