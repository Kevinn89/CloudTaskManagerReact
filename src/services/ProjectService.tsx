
import { apiClient } from "./apiClient";
import type { TaskResponse } from "./TaskService";

export type CreateProjectRequest = {
    name: string;
    description: string;
};

export type UpdateProjectRequest = {
    projectId: Number;
    name: string;
    description: string;
    projectStatus: string;
    priorityStatus: string;

};


export type ProjectResponse = {
    id: number;
    name: string;
    description: string;
    taskCount: number;
    createdAt: string;
    updatedAt: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    tasks: TaskResponse[];
};

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "CLOSED" | "ARCHIVED";

export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH";


export async function createProject(request: CreateProjectRequest): Promise<ProjectResponse> {
    return (await apiClient.post("/api/project/create", request)).data;
}

export async function updateProject(request: UpdateProjectRequest): Promise<ProjectResponse> {
    return (await apiClient.put("/api/project/update", request)).data;
}

export async function completeProject(projectId: Number): Promise<ProjectResponse> {
    return (await apiClient.put(`/api/project/${projectId}/complete`)).data;
}

export async function deleteProject(projectId: Number): Promise<ProjectResponse> {
    return (await apiClient.delete(`/api/project/${projectId}`)).data;
}

export async function getProject(projectId: Number): Promise<ProjectResponse> {
    return (await apiClient.get(`/api/project/${projectId}`)).data;
}

export async function getUserProjects(): Promise<ProjectResponse[]> {
    return (await apiClient.get<ProjectResponse[]>("/api/project/user-projects")).data;
}
