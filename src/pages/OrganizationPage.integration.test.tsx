import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getUserOrganizations } from "../services/OrgService";
import authReducer, { setUser } from "../store/AuthSlice";
import orgReducer from "../store/OrgSlice";
import projectReducer from "../store/ProjectSlice";
import { useAppSelector } from "../store/hooks";
import { makeOrg } from "../test/factories";
import OrganizationPage from "./OrganizationPage";

vi.mock("../services/OrgService", async () => {
    const actual = await vi.importActual<typeof import("../services/OrgService")>("../services/OrgService");

    return {
        ...actual,
        getUserOrganizations: vi.fn(),
    };
});

function makeStore() {
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
        privileges: ["CREATE"],
    }));

    return store;
}

function SelectedOrgRoute() {
    const selectedOrg = useAppSelector(state => state.org.selectedOrg);

    return <p>Selected organization: {selectedOrg?.name ?? "none"}</p>;
}

describe("OrganizationPage integration", () => {
    beforeEach(() => {
        vi.mocked(getUserOrganizations).mockReset();
    });

    it("loads organizations and stores the selected organization when a link is clicked", async () => {
        const org = makeOrg({ id: 20, name: "Platform Team" });
        const user = userEvent.setup();

        vi.mocked(getUserOrganizations).mockResolvedValue([org]);

        render(
            <Provider store={makeStore()}>
                <MemoryRouter initialEntries={["/organization/home"]}>
                    <Routes>
                        <Route path="/organization/home" element={<OrganizationPage />} />
                        <Route path="/organization/home/:orgId" element={<SelectedOrgRoute />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        expect(await screen.findByRole("link", { name: org.name })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "My Organization Admin" })).toBeInTheDocument();

        await user.click(screen.getByRole("link", { name: org.name }));

        expect(screen.getByText(`Selected organization: ${org.name}`)).toBeInTheDocument();
    });

    it("shows an empty state when the user has no organizations", async () => {
        vi.mocked(getUserOrganizations).mockResolvedValue([]);

        render(
            <Provider store={makeStore()}>
                <MemoryRouter>
                    <OrganizationPage />
                </MemoryRouter>
            </Provider>
        );

        expect(await screen.findByText("No Organizations")).toBeInTheDocument();
    });
});
