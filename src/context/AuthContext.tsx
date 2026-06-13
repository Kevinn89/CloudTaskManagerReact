import { createContext, type ReactNode, useContext, useState } from 'react';


type UserResponse = { //Get for account creation at registration
    token: string;
    tokenExpiration: string;
    refreshToken: string;
    refreshTokenExpiration: string;
    email: string;
    privileges: string[];
}

type AuthContextType = {
    user: UserResponse | null;
    login: (user: UserResponse) => void;
    logout: () => void;
    token: string;
    isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProps = {

    children: ReactNode
}

export default function AuthProvider({ children }: AuthProps) {

    const [user, setUser] = useState<UserResponse | null>(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            return null;
        }

        try {
            return JSON.parse(user) as UserResponse;

        } catch {
            localStorage.removeItem("user")
            return null;
        }

    });

    const token = user?.token ?? "";


    function logout() {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("email")
    }

    function login(user: UserResponse) {

        setUser(user)
        localStorage.setItem("token", user.token);
        localStorage.setItem("email", user.email);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("privileges", JSON.stringify(user.privileges));
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: user !== null,
            }}
        >
            {children}
        </AuthContext.Provider>
    );

}


export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }

    return context;
}

