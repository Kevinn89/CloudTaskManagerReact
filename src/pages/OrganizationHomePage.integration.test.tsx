import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addUserToOrg, deleteOrganization, getOrganization } from "../services/OrgService";
import { getNonOrgUsers } from "../services/UserService";
import authReducer, { setUser } from "../store/AuthSlice";
import orgReducer, { addOrg } from "../store/OrgSlice";
import projectReducer from "../store/ProjectSlice";
import { makeOrg, makeUser } from "../test/factories";
import OrganizationHomePage from "./OrganizationHomePage";

vi.mock("../services/OrgService", async () => {
    const actual = await vi.importActual<typeof import("../services/OrgService")>("../services/OrgService");

    return {
        ...actual,
        addUserToOrg: vi.fn(),
        deleteOrganization: vi.fn(),
        getOrganization: vi.fn(),
    };
});

vi.mock("../services/UserService", async () => {
    const actual = await vi.importActual<typeof import("../services/UserService")>("../services/UserService");

    return {
        ...actual,
        getNonOrgUsers: vi.fn(),
    };
});

function makeStore() {
    const org = makeOrg({ id: 20, name: "Platform Team" });
    const store = configureStore({
        reducer: {
            auth: authReducer,
            org: orgReducer,
            project: projectReducer,
        },
    });

    store.dispatch(setUser({
        token: "access-token",
        tokenExpiration: "2026-06-30T00:00:00.000Z",
        refreshToken: "refresh-token",
        refreshTokenExpiration: "2026-07-30T00:00:00.000Z",
        email: "admin@example.com",
        privileges: ["CREATE", "DELETE"],
    }));
    store.dispatch(addOrg(org));

    return store;
}

describe("OrganizationHomePage integration", () => {
    beforeEach(() => {
        vi.mocked(addUserToOrg).mockReset();
        vi.mocked(deleteOrganization).mockReset();
        vi.mocked(getOrganization).mockReset();
        vi.mocked(getNonOrgUsers).mockReset();
    });

    it("loads organization details, selects a user, and adds that user to the organization", async () => {
        const org = makeOrg({ id: 20, name: "Platform Team" });
        const userToAdd = makeUser({ id: 99, name: "Jordan User", email: "jordan@example.com" });
        const store = makeStore();
        const user = userEvent.setup();

        vi.mocked(getOrganization).mockResolvedValue(org);
        vi.mocked(getNonOrgUsers).mockResolvedValue([userToAdd]);
        vi.mocked(addUserToOrg).mockResolvedValue(undefined);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/organization/admin/20/home"]}>
                    <Routes>
                        <Route
                            path="/organization/admin/:orgId/home"
                            element={<OrganizationHomePage isAllowed />}
                        />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        expect(await screen.findByText("Platform Team")).toBeInTheDocument();

        await user.type(screen.getByLabelText(/search name/i), "Jordan");
        await user.click(await screen.findByRole("button", { name: /Jordan User/i }));
        await user.click(screen.getByRole("button", { name: "Add to Org" }));

        expect(addUserToOrg).toHaveBeenCalledWith(org.id, userToAdd.id);
        expect(screen.queryByRole("button", { name: /Jordan User/i })).not.toBeInTheDocument();
        expect(store.getState().org.selectedUser).toEqual(userToAdd);
    });

    it("deletes an organization and removes it from the Redux cache", async () => {
        const org = makeOrg({ id: 20, name: "Platform Team" });
        const store = makeStore();
        const user = userEvent.setup();

        vi.mocked(getOrganization).mockResolvedValue(org);
        vi.mocked(getNonOrgUsers).mockResolvedValue([]);
        vi.mocked(deleteOrganization).mockResolvedValue(org);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/organization/admin/20/home"]}>
                    <Routes>
                        <Route
                            path="/organization/admin/:orgId/home"
                            element={<OrganizationHomePage isAllowed />}
                        />
                        <Route path="/organization/admin" element={<p>Admin org route</p>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        expect(await screen.findByText("Platform Team")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Delete" }));

        expect(deleteOrganization).toHaveBeenCalledWith(org.id);
        expect(store.getState().org.orgs).toEqual([]);
        expect(screen.getByText("Admin org route")).toBeInTheDocument();
    });
});
