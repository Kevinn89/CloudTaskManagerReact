
import { apiClient } from "./apiClient";

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type RefreshTokenRequest = {
    refreshToken: string;
    email: string;
};

export type LogoutRequest = {
    refreshToken: string;
};

export type AuthResponse = {
    token: string;
    refreshToken: string;
    refreshTokenExpiration: string;
    tokenExpiration: string;
    name: string;
    email: string;
};

export async function register(request: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post("/api/auth/register", request);
}

export async function loginUser(request: LoginRequest): Promise<AuthResponse> {
    return (await apiClient.post("/api/auth/login", request)).data;
}

export async function refreshToken(request: RefreshTokenRequest
): Promise<AuthResponse> {
    return apiClient.post("/api/auth/refresh", request);
}

export async function logoutUser(request: LogoutRequest): Promise<void> {
    return apiClient.post("/api/auth/logout", request);
}
