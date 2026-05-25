import { apiClient } from "./apiClient";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskResponse = {
    id: number;
    projectId: number;
    // userId: Number;
    title: string;
    description: string;
    taskStatus: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    completionDate: string;
    createdAt: string;
    updatedAt: string;
};


export type CreateTaskRequest = {
    projectId: number;
    title: string;
    description: string;
};

export type UpdateTaskRequest = {
    id: number;
    projectId: number;
    title: string;
    description: string;
    taskStatus: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    // completionDate: string;
};

export async function createTask(request: CreateTaskRequest): Promise<TaskResponse> {
    return (await apiClient.post("/api/task/create", request)).data;
}

export async function updateTask(request: UpdateTaskRequest): Promise<TaskResponse> {
    return (await apiClient.put("/api/task/update", request)).data;
}

export async function completeTask(taskId: number): Promise<TaskResponse> {
    return (await apiClient.put(`/api/task/${taskId}/complete`)).data;
}

export async function deleteTask(taskId: number, projectId: number): Promise<TaskResponse> {
    return (await apiClient.delete(`/api/task/${taskId}/project/${projectId}`)).data;
}

export async function getTask(taskId: number): Promise<TaskResponse> {
    return (await apiClient.get(`/api/task/${taskId}/`)).data;
}

export async function getProjectTasks(projectId: number): Promise<TaskResponse[]> {
    return (await apiClient.get(`/api/task/project/${projectId}`)).data;
}
