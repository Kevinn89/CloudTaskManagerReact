import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateTask } from "../services/TaskService";
import authReducer, { setUser } from "../store/AuthSlice";
import orgReducer from "../store/OrgSlice";
import projectReducer, { setProjects, setSelectedTask } from "../store/ProjectSlice";
import { makeProject, makeTask } from "../test/factories";
import EditTaskPage from "./EditTaskPage";

vi.mock("../services/TaskService", async () => {
    const actual = await vi.importActual<typeof import("../services/TaskService")>("../services/TaskService");

    return {
        ...actual,
        updateTask: vi.fn(),
    };
});

function makeStore() {
    const task = makeTask({ id: 1, projectId: 10, title: "Old task title" });
    const project = makeProject({ id: 10, tasks: [task], taskCount: 1 });
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
    store.dispatch(setProjects([project]));
    store.dispatch(setSelectedTask(task));

    return store;
}

describe("EditTaskPage integration", () => {
    beforeEach(() => {
        vi.mocked(updateTask).mockReset();
    });

    it("updates a task through the service, writes it to the project cache, and navigates back", async () => {
        const store = makeStore();
        const user = userEvent.setup();
        const updatedTask = makeTask({
            id: 1,
            projectId: 10,
            title: "Updated task title",
            description: "Updated task body",
        });

        vi.mocked(updateTask).mockResolvedValue(updatedTask);

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/task/1/edit"]}>
                    <Routes>
                        <Route path="/task/:taskId/edit" element={<EditTaskPage />} />
                        <Route path="/projects/:projectId/edit" element={<p>Edit project route</p>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const titleInput = screen.getByLabelText(/task title/i);
        const descriptionInput = screen.getByLabelText(/description/i);

        await user.clear(titleInput);
        await user.type(titleInput, updatedTask.title);
        await user.clear(descriptionInput);
        await user.type(descriptionInput, updatedTask.description);
        await user.click(screen.getByRole("button", { name: "Update" }));

        expect(updateTask).toHaveBeenCalledWith({
            id: updatedTask.id,
            projectId: updatedTask.projectId,
            title: updatedTask.title,
            description: updatedTask.description,
            taskStatus: updatedTask.taskStatus,
            priority: updatedTask.priority,
            dueDate: updatedTask.dueDate,
        });
        expect(store.getState().project.projects[0].tasks[0]).toEqual(updatedTask);
        expect(store.getState().project.selectedTask).toEqual(updatedTask);
        expect(screen.getByText("Edit project route")).toBeInTheDocument();
    });
});
