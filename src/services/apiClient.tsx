import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

type UserResponse = {
    id: number;
    name: string;
    email: string;
    token: string;
    tokenExpiration: string;
    refreshToken: string;
    refreshTokenExpiration: string;
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

            const userJson = localStorage.getItem("user");
            const user: UserResponse | null = userJson ? JSON.parse(userJson) : null

            if (!user) {
                localStorage.removeItem("user");
                return Promise.reject(error)
            }

            try {

                const response = await apiClient.post("/api/auth/refresh").catch(error => console.log(error));
                console.log(response);
                return apiClient(originalRequest);

            }
            catch (refreshError) {
                localStorage.removeItem("user")
                return Promise.reject(refreshError)

            }
        }
        return Promise.reject(error);

    }
);

