import type { ProjectResponse } from "../services/ProjectService";
import type { TaskResponse } from "../services/TaskService";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// export type ProjectAction =
//     | { type: "SET_PROJECTS"; payload: ProjectResponse[] }
//     | { type: "SET_SELECTED_PROJECT"; payload: ProjectResponse | null }
//     | { type: "SET_SELECTED_TASK"; payload: TaskResponse | null }
//     | { type: "SET_HAS_LOADED_PROJECTS"; payload: boolean }
//     | { type: "ADD_PROJECT"; payload: ProjectResponse }
//     | { type: "UPDATE_PROJECT"; payload: ProjectResponse }
//     | { type: "REMOVE_PROJECT"; payload: number }
//     | { type: "CLEAR_PROJECTS" }
//     | { type: "ADD_TASK_TO_SELECTED_PROJECT"; payload: TaskResponse }
//     | { type: "REMOVE_TASK_FROM_SELECTED_PROJECT"; payload: TaskResponse }
//     | { type: "UPDATE_TASK_IN_SELECTED_PROJECT"; payload: TaskResponse };

export type ProjectState = {
    projects: ProjectResponse[];
    selectedProject: ProjectResponse | null;
    hasLoadedProjects: boolean;
    selectedTask: TaskResponse | null;
};

const initialState: ProjectState = {
    projects: [],
    selectedProject: null,
    hasLoadedProjects: false,
    selectedTask: null
};

// export function projectReducer(
//     state  : ProjectState = initialProjectState,
//     action: ProjectAction
// ): ProjectState {
//     switch (action.type) {
//         case "SET_PROJECTS": {
//             return {
//                 ...state,
//                 projects: action.payload
//             };
//         }

//         case "SET_SELECTED_PROJECT": {

//             const project = {
//                 ...state,
//                 selectedProject: action.payload
//             };

//             if (project.selectedProject) {
//                 localStorage.setItem("project_id", project.selectedProject?.id.toString());
//             }

//             return project;
//         }

//         case "SET_HAS_LOADED_PROJECTS": {

//             return {
//                 ...state,
//                 hasLoadedProjects: action.payload
//             };

//         }

//         case "ADD_PROJECT": {

//             return {
//                 ...state,
//                 projects: [...state.projects, action.payload]
//             };

//         }

//         case "UPDATE_PROJECT": {
//             const updatedProject = action.payload;

//             return {
//                 ...state,
//                 projects: state.projects.map(project =>
//                     project.id === updatedProject.id ? updatedProject : project
//                 ),
//                 selectedProject:
//                     state.selectedProject?.id === updatedProject.id
//                         ? updatedProject
//                         : state.selectedProject
//             };
//         }

//         case "REMOVE_PROJECT": {
//             const projectId = action.payload;

//             if (projectId) {
//                 localStorage.removeItem("project_id")
//             }

//             return {
//                 ...state,
//                 projects: state.projects.filter(project => project.id !== projectId),
//                 selectedProject:
//                     state.selectedProject?.id === projectId
//                         ? null
//                         : state.selectedProject,
//                 selectedTask:
//                     state.selectedTask?.projectId === projectId
//                         ? null
//                         : state.selectedTask
//             };
//         }

//         case "CLEAR_PROJECTS": {

//             return {
//                 projects: [],
//                 selectedProject: null,
//                 hasLoadedProjects: false,
//                 selectedTask: null
//             };

//         }


//         case "ADD_TASK_TO_SELECTED_PROJECT": {
//             const task = action.payload;

//             return {
//                 ...state,
//                 projects: state.projects.map(project =>
//                     project.id === task.projectId
//                         ? {
//                             ...project,
//                             taskCount: project.taskCount + 1,
//                             tasks: [...project.tasks, task]
//                         }
//                         : project
//                 ),

//                 selectedProject:
//                     state.selectedProject?.id === task.projectId
//                         ? {
//                             ...state.selectedProject,
//                             taskCount: state.selectedProject.taskCount + 1,
//                             tasks: [...state.selectedProject.tasks, task]
//                         }
//                         : state.selectedProject
//             };
//         }

//         case "REMOVE_TASK_FROM_SELECTED_PROJECT": {
//             const taskToRemove = action.payload;

//             return {
//                 ...state,
//                 selectedTask:
//                     state.selectedTask?.id === taskToRemove.id
//                         ? null
//                         : state.selectedTask,
//                 selectedProject:
//                     state.selectedProject?.id === taskToRemove.projectId
//                         ? {
//                             ...state.selectedProject,
//                             taskCount: Math.max(state.selectedProject.taskCount - 1, 0),
//                             tasks: [...state.selectedProject.tasks, taskToRemove]
//                         }
//                         : state.selectedProject,
//                 projects: state.projects.map(project =>
//                     project.id === taskToRemove.projectId
//                         ? {
//                             ...project,
//                             taskCount: Math.max(project.taskCount - 1, 0),
//                             tasks: project.tasks.filter(
//                                 currentTask => currentTask.id !== taskToRemove.id
//                             )
//                         }
//                         : project
//                 )
//             };
//         }

//         case "SET_SELECTED_TASK": {

//             return {
//                 ...state,
//                 selectedTask: action.payload
//             };

//         }

//         case "UPDATE_TASK_IN_SELECTED_PROJECT": {
//             const updateTask = action.payload;

//             return {
//                 ...state,
//                 selectedTask:
//                     state.selectedTask?.id === updateTask.id
//                         ? updateTask
//                         : state.selectedTask,
//                 projects: state.projects.map(project =>
//                     project.id === updateTask.projectId
//                         ? {
//                             ...project,
//                             tasks: [...project.tasks, updateTask]
//                         }
//                         : project
//                 ),
//                 selectedProject:
//                     state.selectedProject?.id === updateTask.projectId
//                         ? {
//                             ...state.selectedProject,
//                             tasks: state.selectedProject.tasks.map(currentTask =>
//                                 currentTask.id === updateTask.id ? updateTask : currentTask
//                             )
//                         }
//                         : state.selectedProject
//             };
//         }

//         default:
//             return state;
//     }
// }

// const initialState: ProjectState = {
//     projects: [],
//     selectedProject: null,
//     hasLoadedProjects: false,
//     selectedTask: null,
// };

const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setProjects(state, action: PayloadAction<ProjectResponse[]>) {
            state.projects = action.payload;
        },
        setSelectedProject(state, action: PayloadAction<ProjectResponse>) {
            state.selectedProject = action.payload

            if (action.payload) {
                localStorage.setItem("project_id", action.payload.id.toString())
            }
        },
        setHasLoadedProjects(state, action: PayloadAction<boolean>) {
            state.hasLoadedProjects = action.payload;
        },
        setSelectedTask(state, action: PayloadAction<TaskResponse>) {

            state.selectedTask = action.payload;
        },
        addProject(state, action: PayloadAction<ProjectResponse>) {
            state.projects.push(action.payload);
        },
        updateProjectInState(state, action: PayloadAction<ProjectResponse>) {

            const updatedProject = action.payload;

            state.projects = state.projects.map(project => project.id === updatedProject.id ? updatedProject : project);

            if (state.selectedProject?.id === updatedProject.id) {
                state.selectedProject = updatedProject
            }

        },

        removeProjectFromState(state, action: PayloadAction<number>) {
            const projectId = action.payload;

            localStorage.removeItem("project_id");

            state.projects.map(project => project.id === projectId ? null : project);

            if (state.selectedProject?.id === projectId) {
                state.selectedProject = null;
            }
        },

        clearProjects() {
            localStorage.removeItem("project_id")
            return initialState;
        },

        addTaskToSelectedProject(state, action: PayloadAction<TaskResponse>) {
            const task = action.payload;

            state.projects = state.projects.map(pro =>
                pro.id === task.projectId ? {
                    ...pro,
                    taskCount: pro.taskCount + 1,
                    task: [...pro.tasks, task]
                } : pro
            );

            if (state.selectedProject?.id === task.projectId) {
                state.selectedProject?.tasks.push(task);
                state.selectedProject.taskCount += 1;
            }
        },

        removeTaskFromSelectedProject(state, action: PayloadAction<TaskResponse>) {

            const taskToRemove = action.payload;

            if (state.selectedTask?.id === taskToRemove.id) {
                state.selectedProject = null
            }

            state.projects.map(project =>
                project.id === taskToRemove.id ? {
                    ...project,
                    tasks: project.tasks.map(task =>
                        task.id === taskToRemove.id ? null : task),
                    taskCount: project.taskCount - 1
                } : project
            )
        },

        updateTaskInSelectedProject(state, action: PayloadAction<TaskResponse>) {

            const task = action.payload;

            if (state.selectedTask?.id === task.id) {
                state.selectedTask = task
            }

            state.projects = state.projects.map(project =>
                project.id === task.id ? {
                    ...project,
                    tasks: project.tasks.map(t => t.id === task.id ? task : t)
                } : project
            )
        }



    }


});




export const {
    setProjects,
    setSelectedProject,
    setHasLoadedProjects,
    setSelectedTask,
    addProject,
    updateProjectInState,
    removeProjectFromState,
    clearProjects,
    addTaskToSelectedProject,
    removeTaskFromSelectedProject,
    updateTaskInSelectedProject,
} = projectSlice.actions;

export default projectSlice.reducer;