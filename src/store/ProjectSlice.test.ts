import { describe, expect, it } from "vitest";
import projectReducer, {
    addProject,
    addTaskToSelectedProject,
    removeProjectFromState,
    removeTaskFromSelectedProject,
    setProjects,
    setSelectedTask,
    updateTaskInSelectedProject,
} from "./ProjectSlice";
import { makeProject, makeTask } from "../test/factories";

describe("ProjectSlice", () => {
    it("adds a task to the matching cached project", () => {
        // Arrange: build a project with no tasks and a task that belongs to it.
        const project = makeProject();
        const task = makeTask({ projectId: project.id });

        // Act: call the reducer directly, the same way Redux would call it after dispatch.
        const withProject = projectReducer(undefined, setProjects([project]));
        const nextState = projectReducer(withProject, addTaskToSelectedProject(task));

        // Assert: the matching project received the task and the selected id was updated.
        expect(nextState.projects[0].tasks).toEqual([task]);
        expect(nextState.projects[0].taskCount).toBe(1);
        expect(nextState.selectedProjectId).toBe(project.id);
    });

    it("updates a task inside the matching cached project and selected task", () => {
        // Arrange: create old state with one task, then create the replacement task.
        const oldTask = makeTask({ title: "Old title" });
        const updatedTask = makeTask({ title: "Updated title", description: "Updated description" });
        const project = makeProject({ tasks: [oldTask], taskCount: 1 });

        // Act: seed the reducer state, select the old task, then apply the update action.
        const withProject = projectReducer(undefined, setProjects([project]));
        const withSelectedTask = projectReducer(withProject, setSelectedTask(oldTask));
        const nextState = projectReducer(withSelectedTask, updateTaskInSelectedProject(updatedTask));

        // Assert: both the project task list and selectedTask now point at the updated task.
        expect(nextState.projects[0].tasks[0]).toEqual(updatedTask);
        expect(nextState.selectedTask).toEqual(updatedTask);
    });

    it("removes a task from the matching cached project and clears selected task", () => {
        // Arrange: one cached project with one selected task.
        const task = makeTask();
        const project = makeProject({ tasks: [task], taskCount: 1 });

        // Act: remove that task through the reducer.
        const withProject = projectReducer(undefined, setProjects([project]));
        const withSelectedTask = projectReducer(withProject, setSelectedTask(task));
        const nextState = projectReducer(withSelectedTask, removeTaskFromSelectedProject(task));

        // Assert: the task list is empty, count is corrected, and selectedTask is cleared.
        expect(nextState.projects[0].tasks).toEqual([]);
        expect(nextState.projects[0].taskCount).toBe(0);
        expect(nextState.selectedTask).toBeNull();
    });

    it("upserts projects in the cache", () => {
        // Arrange: same project id, different project name.
        const project = makeProject({ name: "Original" });
        const updatedProject = makeProject({ name: "Updated" });

        // Act: add the original, then add another project with the same id.
        const withProject = projectReducer(undefined, addProject(project));
        const nextState = projectReducer(withProject, addProject(updatedProject));

        // Assert: cache behavior should replace the existing project, not duplicate it.
        expect(nextState.projects).toHaveLength(1);
        expect(nextState.projects[0].name).toBe("Updated");
    });

    it("removes a project and clears related selected state", () => {
        // Arrange: one project with a selected task that belongs to that project.
        const task = makeTask({ projectId: 10 });
        const project = makeProject({ id: 10, tasks: [task], taskCount: 1 });

        // Act: remove the project.
        const withProject = projectReducer(undefined, setProjects([project]));
        const withSelectedTask = projectReducer(withProject, setSelectedTask(task));
        const nextState = projectReducer(withSelectedTask, removeProjectFromState(project.id));

        // Assert: removing a project should also clear selected task state tied to it.
        expect(nextState.projects).toEqual([]);
        expect(nextState.selectedTask).toBeNull();
    });
});
