import type { ProjectResponse } from "../services/ProjectService";
import type { TaskResponse } from "../services/TaskService";

export function makeTask(overrides: Partial<TaskResponse> = {}): TaskResponse {
    return {
        id: 1,
        projectId: 10,
        title: "Draft rollout plan",
        description: "Create the first version of the release checklist.",
        taskStatus: "TODO",
        priority: "HIGH",
        dueDate: "2026-06-30T00:00:00.000Z",
        completionDate: "",
        createdAt: "2026-06-01T00:00:00.000Z",
        updatedAt: "2026-06-01T00:00:00.000Z",
        ...overrides,
    };
}

export function makeProject(overrides: Partial<ProjectResponse> = {}): ProjectResponse {
    const tasks = overrides.tasks ?? [];

    return {
        id: 10,
        name: "Cloud Migration",
        description: "Move workloads into the cloud task platform.",
        taskCount: tasks.length,
        createdAt: "2026-06-01T00:00:00.000Z",
        updatedAt: "2026-06-01T00:00:00.000Z",
        status: "ACTIVE",
        priority: "HIGH",
        tasks,
        ...overrides,
    };
}
