// src/routes/AppRoutes.ts


export const RoutePatterns = {
    home: "/",
    dashboardHome: "/home",

    login: "/login",
    register: "/register",

    projects: "/projects",
    createProject: "/create-project",
    projectTasks: "/projects/:projectId/task",
    editProject: "/projects/:projectId/edit",
    createTask: "/projects/:projectId/create-task",
    editTask: "/task/:taskId/edit",
    organizaionRoot: "/organization",
    organizations: "/organization/home",
    createOrganization: "/organization/create",
    editOrganization: "/organization/:orgId/edit",
    organizationHome: "/organization/home/:orgId",
    adminOrganizations: "/organization/admin",
    adminOrganizationHome: "/organization/admin/:orgId/home",
} as const;

export const AppPaths = {
    home: () => "/",
    dashboardHome: () => "/home",

    login: () => "/login",
    register: () => "/register",

    projects: () => "/projects",
    createProject: () => "/create-project",
    projectTasks: (projectId: number | string) => `/projects/${projectId}/task`,
    editProject: (projectId: number | string) => `/projects/${projectId}/edit`,
    createTask: (projectId: number | string) =>
        `/projects/${projectId}/create-task`,
    editTask: (taskId: number | string) => `/task/${taskId}/edit`,

    organizations: () => "/organization/home",
    createOrganization: () => "/organization/create",
    editOrganization: (orgId: number | string) =>
        `/organization/${orgId}/edit`,
    organizationHome: (orgId: number | string) =>
        `/organization/home/${orgId}`,
    adminOrganizations: () => "/organization/admin",
    adminOrganizationHome: (orgId: number | string) =>
        `/organization/admin/${orgId}/home`,
} as const;