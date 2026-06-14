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
        },
        logoutUser(state) {
            state.user = null;

        }
    }
});

export const { setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
