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
});


apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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

            if (!user?.refreshToken) {
                localStorage.removeItem("user");
                return Promise.reject(error)
            }
            console.log(`email: ${user.email}`)
            console.log(`refreshToken: ${user.refreshToken}`)

            try {
                const refreshResponse = await axios.post<UserResponse>(
                    `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
                    {
                        refreshToken: user.refreshToken,
                        email: user.email
                    }
                );

                const updatedUser: UserResponse = {
                    ...user,
                    token: refreshResponse.data.token,
                    tokenExpiration: refreshResponse.data.tokenExpiration,
                    refreshToken: refreshResponse.data.refreshToken,
                    refreshTokenExpiration: refreshResponse.data.refreshTokenExpiration
                };

                localStorage.setItem("user", JSON.stringify(updatedUser))
                localStorage.setItem("token", updatedUser.token);
                originalRequest.headers.Authorization = `Bearer ${updatedUser.token}`;

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

