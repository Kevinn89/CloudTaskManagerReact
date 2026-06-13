
import { apiClient } from "./apiClient";


export type UserTempPrivilegesRequest = {
    id: Number;
    name: string;
    privileges: string[];
};

export type UpdateUserRequest = {
    id: Number;
    name: string;
    description: string;
};

export type UserResponse = {
    id: number
    name: string;
    email: string;
};



export async function addTempUserPrivileges(request: UserTempPrivilegesRequest): Promise<void> {
    return (await apiClient.post("/api/user/addTempPriviledges", request)).data;
}

export async function updateUser(request: UpdateUserRequest): Promise<UserResponse> {
    return (await apiClient.put("/api/user/update", request)).data;
}

export async function removeUser(orgId: number): Promise<UserResponse> {
    return (await apiClient.delete(`/api/delete/${orgId}`)).data;
}

export async function getUsers(): Promise<UserResponse[]> {
    return (await apiClient.get("/api/user/allUsers")).data;
}

export async function getNonOrgUsers(orgId: number): Promise<UserResponse[]> {
    return (await apiClient.get(`/api/user/${orgId}`)).data;
}


