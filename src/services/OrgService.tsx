
import { apiClient } from "./apiClient";

export type CreateOrgRequest = {
    name: string;
    description: string;
};

export type UpdateOrgRequest = {
    id: Number;
    name: string;
    description: string;
};


export type OrgResponse = {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    memberCount: number
    // updatedAt: string;
};

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "CLOSED" | "ARCHIVED";

export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH";


export async function createOrganziation(request: CreateOrgRequest): Promise<OrgResponse> {
    return (await apiClient.post("/api/organization/create", request)).data;
}

// export async function updateOrganization(request: UpdateOrgRequest): Promise<OrgResponse> {
//     return (await apiClient.put("/api/organization/update", request)).data;
// }

export async function deleteOrganization(orgId: number): Promise<OrgResponse> {
    return (await apiClient.delete(`/api/organization/${orgId}`)).data;
}

export async function getOrganization(orgId: number): Promise<OrgResponse> {
    return (await apiClient.get(`/api/organization/${orgId}`)).data;
}

export async function getUserOrganizations(): Promise<OrgResponse[]> {
    return (await apiClient.get("/api/organization/user-orgs")).data;
}

export async function getAdminOrgs(): Promise<OrgResponse[]> {
    return (await apiClient.get("/api/organization/admin-orgs")).data;
}

export async function addUserToOrg(orgId: number, userId: number): Promise<void> {
    return (await apiClient.post(`/api/organization/${orgId}/addUser/${userId}`)).data;
}
