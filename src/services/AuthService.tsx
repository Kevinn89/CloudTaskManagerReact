
import { apiClient } from "./apiClient";

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
    accountType: string
};

export type LoginRequest = {
    email: string;
    password: string;
};

// export type RefreshTokenRequest = {
//     // refreshToken: string;
//     // email: string;
// };

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
    privileges: string[]
};

export async function register(request: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post("/api/auth/register", request);
}

export async function loginUser(request: LoginRequest): Promise<AuthResponse> {
    return (await apiClient.post("/api/auth/login", request)).data;
}

// export async function refreshToken()
//     : Promise<AuthResponse> {
//     return apiClient.post("/api/auth/refresh");
// }

export async function logoutUser(): Promise<void> {
    return apiClient.post("/api/auth/logout");
}
