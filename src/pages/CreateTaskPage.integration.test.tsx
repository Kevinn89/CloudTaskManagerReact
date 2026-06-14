import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authReducer, { setUser } from "../store/AuthSlice";
import projectReducer, { setProjects } from "../store/ProjectSlice";
import { makeProject, makeTask } from "../test/factories";
import CreateTaskPage from "./CreateTaskPage";
import { createTask } from "../services/TaskService";

// Mock only the service function that talks to the backend.
// This is similar to mocking a Spring service/repository in a controller test.
vi.mock("../services/TaskService", async () => {
    const actual = await vi.importActual<typeof import("../services/TaskService")>("../services/TaskService");

    return {
        ...actual,
        createTask: vi.fn(),
    };
});

function makeStore() {
    // Build a real Redux store for this test. We are not mocking reducers here,
    // because the integration behavior depends on the reducer updating cache state.
    const project = makeProject({ id: 10, tasks: [], taskCount: 0 });
    const store = configureStore({
        reducer: {
            auth: authReducer,
            project: projectReducer,
        },
    });

    // Seed the store with a logged-in user who has permission to create tasks.
    store.dispatch(setUser({
        token: "access-token",
        tokenExpiration: "2026-06-30T00:00:00.000Z",
        refreshToken: "refresh-token",
        refreshTokenExpiration: "2026-07-30T00:00:00.000Z",
        email: "admin@example.com",
        privileges: ["CREATE"],
    }));

    // Seed the project cache so CreateTaskPage can add the new task to this project.
    store.dispatch(setProjects([project]));

    return store;
}

describe("CreateTaskPage integration", () => {
    beforeEach(() => {
        // Reset the mocked API function before each test so calls from one test
        // cannot affect another test.
        vi.mocked(createTask).mockReset();
    });

    it("creates a task, stores it in the project cache, and returns to the edit page", async () => {
        // Arrange: this is the fake API response returned by createTask.
        const createdTask = makeTask({
            id: 99,
            projectId: 10,
            title: "Write launch checklist",
            description: "Document the release steps.",
        });
        const store = makeStore();
        const user = userEvent.setup();

        // Arrange: tell the mocked backend call to resolve successfully.
        vi.mocked(createTask).mockResolvedValue(createdTask);

        // Act: render the page inside Redux and an in-memory router.
        // MemoryRouter lets the test start at /projects/10/create-task without a browser.
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/projects/10/create-task"]}>
                    <Routes>
                        <Route path="/projects/:projectId/create-task" element={<CreateTaskPage />} />
                        <Route path="/projects/:projectId/edit" element={<p>Edit project route</p>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Act: fill out the form the way a user would.
        await user.type(screen.getByPlaceholderText("Task Name"), createdTask.title);
        await user.type(screen.getAllByRole("textbox")[1], createdTask.description);
        await user.click(screen.getByRole("button", { name: "Create" }));

        // Assert: the page called the service with the request body we expect.
        expect(createTask).toHaveBeenCalledWith({
            projectId: 10,
            title: createdTask.title,
            description: createdTask.description,
        });

        // Assert: the real reducer stored the created task in the project cache.
        expect(store.getState().project.projects[0].tasks).toEqual([createdTask]);

        // Assert: after create succeeds, the app navigates back to the edit project route.
        expect(screen.getByText("Edit project route")).toBeInTheDocument();
    });
});
