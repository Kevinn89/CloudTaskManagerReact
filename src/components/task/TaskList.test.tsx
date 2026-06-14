import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import authReducer, { setUser } from "../../store/AuthSlice";
import projectReducer from "../../store/ProjectSlice";
import { makeTask } from "../../test/factories";
import Task from "./Task";
import TaskList from "./TaskList";

function makeStore() {
    // Each test gets a fresh Redux store so tests do not leak state into each other.
    const store = configureStore({
        reducer: {
            auth: authReducer,
            project: projectReducer,
        },
    });

    // Task renders require an authenticated user, so seed auth like a logged-in session.
    store.dispatch(setUser({
        token: "access-token",
        tokenExpiration: "2026-06-30T00:00:00.000Z",
        refreshToken: "refresh-token",
        refreshTokenExpiration: "2026-07-30T00:00:00.000Z",
        email: "admin@example.com",
        privileges: ["CREATE", "DELETE"],
    }));

    return store;
}

describe("TaskList", () => {
    it("renders an empty state when there are no tasks", () => {
        // Arrange/Act: render just the component with an empty task array.
        render(<TaskList tasks={[]} editable={false} />);

        // Assert: the user-facing empty state appears.
        expect(screen.getByText("No tasks yet")).toBeInTheDocument();
        expect(screen.getByText("Tasks for this project will appear here.")).toBeInTheDocument();
    });

    it("renders task cards", () => {
        // Arrange: create a realistic task object using the test factory.
        const task = makeTask();

        // Act: render with Redux and router providers because Task uses both.
        render(
            <Provider store={makeStore()}>
                <MemoryRouter>
                    <TaskList tasks={[task]} editable={false} />
                </MemoryRouter>
            </Provider>
        );

        // Assert: verify visible output, similar to checking a controller response body.
        expect(screen.getByText(task.title)).toBeInTheDocument();
        expect(screen.getByText(task.description)).toBeInTheDocument();
        expect(screen.getByText("HIGH priority")).toBeInTheDocument();
    });
});

describe("Task", () => {
    it("stores the selected task and navigates when edit is clicked", async () => {
        // Arrange: create one task, one isolated Redux store, and a user-event driver.
        const task = makeTask();
        const store = makeStore();
        const user = userEvent.setup();

        // Act: render a tiny router with the task page and the destination edit route.
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/projects/10/edit"]}>
                    <Routes>
                        <Route path="/projects/:projectId/edit" element={<Task task={task} enableEdit />} />
                        <Route path="/task/:taskId/edit" element={<p>Edit task route</p>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Act: simulate the real user click instead of calling the click handler directly.
        await user.click(screen.getByRole("button", { name: /edit task/i }));

        // Assert: the click selected the task in Redux and navigated to the edit route.
        expect(store.getState().project.selectedTask).toEqual(task);
        expect(screen.getByText("Edit task route")).toBeInTheDocument();
    });
});
