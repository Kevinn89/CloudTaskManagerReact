import { createContext, type ReactNode, useContext, useReducer } from "react";
import type { ProjectResponse } from "../services/ProjectService";
import type { TaskResponse } from "../services/TaskService";
import { initialProjectState, projectReducer } from "./ProjectReducer";

type ProjectContextType = {
    projects: ProjectResponse[];
    selectedProject: ProjectResponse | null;
    hasLoadedProjects: boolean;
    selectedTask: TaskResponse | null;

    setProjects: (projects: ProjectResponse[]) => void
    setSelectedProject: (selectedProject: ProjectResponse) => void
    setHasLoadedProjects: (hasLoadedProjects: boolean) => void
    setSelectedTask: (task: TaskResponse | null) => void;
    addProject: (project: ProjectResponse) => void;
    updateProjectInState: (updatedProject: ProjectResponse) => void;
    removeProjectFromState: (projectId: number) => void;
    clearProjects: () => void;

    addTaskToSelectedProject: (task: TaskResponse) => void;
    removeTaskFromSelectedProject: (task: TaskResponse) => void;
    updateTaskInSelectedProject: (updatedTask: TaskResponse) => void;
};


const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

type ProjectProviderProps = {
    children: ReactNode;
};

export default function ProjectProvider({ children }: ProjectProviderProps) {
    const [state, dispatch] = useReducer(projectReducer, initialProjectState);

    function setProjects(projects: ProjectResponse[]) {

        dispatch({ type: "SET_PROJECTS", payload: projects });

    }

    function setSelectedProject(project: ProjectResponse | null) {

        dispatch({ type: "SET_SELECTED_PROJECT", payload: project });

    }

    function setHasLoadedProjects(hasLoadedProjects: boolean) {

        dispatch({

            type: "SET_HAS_LOADED_PROJECTS",

            payload: hasLoadedProjects,

        });

    }

    function setSelectedTask(task: TaskResponse | null) {

        dispatch({ type: "SET_SELECTED_TASK", payload: task });

    }

    function addProject(project: ProjectResponse) {

        dispatch({ type: "ADD_PROJECT", payload: project });

    }

    function updateProjectInState(updatedProject: ProjectResponse) {

        dispatch({ type: "UPDATE_PROJECT", payload: updatedProject });

    }

    function removeProjectFromState(projectId: number) {

        dispatch({ type: "REMOVE_PROJECT", payload: projectId });

    }

    function clearProjects() {

        dispatch({ type: "CLEAR_PROJECTS" });

    }

    function addTaskToSelectedProject(task: TaskResponse) {

        dispatch({ type: "ADD_TASK_TO_SELECTED_PROJECT", payload: task });

    }

    function removeTaskFromSelectedProject(task: TaskResponse) {

        dispatch({ type: "REMOVE_TASK_FROM_SELECTED_PROJECT", payload: task });

    }

    function updateTaskInSelectedProject(updatedTask: TaskResponse) {

        dispatch({

            type: "UPDATE_TASK_IN_SELECTED_PROJECT",

            payload: updatedTask,

        });

    }

    return (
        <ProjectContext.Provider
            value={{
                ...state,
                setSelectedTask,
                setProjects,
                setSelectedProject,
                setHasLoadedProjects,
                addProject,
                updateProjectInState,
                removeProjectFromState,
                clearProjects,
                addTaskToSelectedProject,
                removeTaskFromSelectedProject,
                updateTaskInSelectedProject
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjects() {
    const context = useContext(ProjectContext);

    if (context === undefined) {
        throw new Error("useProjects must be used inside a ProjectProvider");
    }

    return context;
}
