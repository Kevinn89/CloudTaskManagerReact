import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


type UserResponse = { //Get for account creation at registration
    token: string;
    tokenExpiration: string;
    refreshToken: string;
    refreshTokenExpiration: string;
    email: string;
    privileges: string[];
}


type AuthState = {

    user: UserResponse | null
}

const initialState: AuthState = {
    user: null
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserResponse>) {
            state.user = action.payload

            localStorage.setItem("token", state.user.token);
            localStorage.setItem("email", state.user.email);
            localStorage.setItem("user", JSON.stringify(state.user));
            localStorage.setItem("privileges", JSON.stringify(state.user.privileges));
        },
        logoutUser(state) {
            state.user = null;

            localStorage.clear()

        }
    }
});

export const { setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;

// export default function AuthProvider({ children }: AuthProps) {

//     const [user, setUser] = useState<UserResponse | null>(() => {
//         const user = localStorage.getItem("user");

//         if (!user) {
//             return null;
//         }

//         try {
//             return JSON.parse(user) as UserResponse;

//         } catch {
//             localStorage.removeItem("user")
//             return null;
//         }

//     });

//     const token = user?.token ?? "";


//     function logout() {
//         setUser(null);
//         localStorage.removeItem("user");
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("email")
//     }

//     function login(user: UserResponse) {

//         setUser(user)
//         localStorage.setItem("token", user.token);
//         localStorage.setItem("email", user.email);
//         localStorage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("privileges", JSON.stringify(user.privileges));
//     }

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 token,
//                 login,
//                 logout,
//                 isAuthenticated: user !== null,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );

// }


// export function useAuth() {
//     const context = useContext(AuthContext);

//     if (context === undefined) {
//         throw new Error("useAuth must be used inside an AuthProvider");
//     }

//     return context;
// }

