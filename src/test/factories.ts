import type { ProjectResponse } from "../services/ProjectService";
import type { OrgResponse } from "../services/OrgService";
import type { TaskResponse } from "../services/TaskService";
import type { UserResponse } from "../services/UserService";

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

export function makeOrg(overrides: Partial<OrgResponse> = {}): OrgResponse {
    return {
        id: 20,
        name: "Platform Team",
        description: "Owns shared cloud task management.",
        createdAt: "2026-06-01T00:00:00.000Z",
        memberCount: 3,
        ...overrides,
    };
}

export function makeUser(overrides: Partial<UserResponse> = {}): UserResponse {
    return {
        id: 30,
        name: "Taylor Admin",
        email: "taylor@example.com",
        ...overrides,
    };
}
