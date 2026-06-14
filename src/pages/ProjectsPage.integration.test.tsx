import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getUserProjects } from "../services/ProjectService";
import authReducer, { setUser } from "../store/AuthSlice";
import orgReducer from "../store/OrgSlice";
import projectReducer from "../store/ProjectSlice";
import { makeProject } from "../test/factories";
import ProjectsPage from "./ProjectsPage";

vi.mock("../services/ProjectService", async () => {
    const actual = await vi.importActual<typeof import("../services/ProjectService")>("../services/ProjectService");

    return {
        ...actual,
        getUserProjects: vi.fn(),
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

describe("ProjectsPage integration", () => {
    beforeEach(() => {
        vi.mocked(getUserProjects).mockReset();
    });

    it("loads user projects, stores them in Redux, and renders project cards", async () => {
        const project = makeProject({ name: "Billing Migration" });
        const store = makeStore();

        vi.mocked(getUserProjects).mockResolvedValue([project]);

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProjectsPage />
                </MemoryRouter>
            </Provider>
        );

        expect(await screen.findByText(project.name)).toBeInTheDocument();
        expect(screen.getByText(project.description)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Create Project" })).toBeInTheDocument();
        expect(store.getState().project.projects).toEqual([project]);
    });

    it("renders the project empty state when the API returns no projects", async () => {
        vi.mocked(getUserProjects).mockResolvedValue([]);

        render(
            <Provider store={makeStore()}>
                <MemoryRouter>
                    <ProjectsPage />
                </MemoryRouter>
            </Provider>
        );

        expect(await screen.findByText("No projects yet")).toBeInTheDocument();
    });
});
