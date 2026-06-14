import { describe, expect, it } from "vitest";
import authReducer, { logoutUser, setUser } from "./AuthSlice";

const testUser = {
    token: "access-token",
    tokenExpiration: "2026-06-30T00:00:00.000Z",
    refreshToken: "refresh-token",
    refreshTokenExpiration: "2026-07-30T00:00:00.000Z",
    email: "admin@example.com",
    privileges: ["CREATE", "DELETE"],
};

describe("AuthSlice", () => {
    it("starts with no authenticated user", () => {
        const state = authReducer(undefined, { type: "unknown" });

        expect(state.user).toBeNull();
    });

    it("stores the authenticated user", () => {
        const state = authReducer(undefined, setUser(testUser));

        expect(state.user).toEqual(testUser);
    });

    it("clears the authenticated user on logout", () => {
        const authenticatedState = authReducer(undefined, setUser(testUser));
        const loggedOutState = authReducer(authenticatedState, logoutUser());

        expect(loggedOutState.user).toBeNull();
    });
});
