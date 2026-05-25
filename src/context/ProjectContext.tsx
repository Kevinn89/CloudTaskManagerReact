import { createContext, type ReactNode, useContext, useState } from "react";
import type { ProjectResponse } from "../services/ProjectService";
import type { TaskResponse } from "../services/TaskService";

type ProjectContextType = {
    projects: ProjectResponse[];
    selectedProject: ProjectResponse | null;
    hasLoadedProjects: boolean;
    setProjects: React.Dispatch<React.SetStateAction<ProjectResponse[]>>;
    setSelectedProject: React.Dispatch<React.SetStateAction<ProjectResponse | null>>;
    setHasLoadedProjects: React.Dispatch<React.SetStateAction<boolean>>;
    addProject: (project: ProjectResponse) => void;
    updateProjectInState: (updatedProject: ProjectResponse) => void;
    removeProjectFromState: (projectId: number) => void;
    clearProjects: () => void;
    addTaskToSelectedProject: (task: TaskResponse) => void;
    removeTaskFromSelectedProject: (task: TaskResponse) => void;
    selectedTask: TaskResponse | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<TaskResponse | null>>;
    updateTaskInSelectedProject: (updatedTask: TaskResponse) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

type ProjectProviderProps = {
    children: ReactNode;
};

export default function ProjectProvider({ children }: ProjectProviderProps) {
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
    const [hasLoadedProjects, setHasLoadedProjects] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);

    function updateTaskInSelectedProject(updatedTask: TaskResponse) {
        setSelectedProject((currentProject) => {
            if (!currentProject) {
                return currentProject;
            }

            return {
                ...currentProject,
                tasks: currentProject.tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                ),
            };
        });

        setProjects((currentProjects) =>
            currentProjects.map((project) =>
                project.id === updatedTask.projectId
                    ? {
                        ...project,
                        tasks: project.tasks.map((task) =>
                            task.id === updatedTask.id ? updatedTask : task
                        ),
                    }
                    : project
            )
        );

        setSelectedTask(updatedTask);
    }

    function addProject(project: ProjectResponse) {
        setProjects((currentProjects) => [...currentProjects, project]);
    }

    function updateProjectInState(updatedProject: ProjectResponse) {
        setProjects((currentProjects) =>
            currentProjects.map((project) =>
                project.id === updatedProject.id ? updatedProject : project
            )
        );

        setSelectedProject((currentProject) =>
            currentProject?.id === updatedProject.id ? updatedProject : currentProject
        );
    }

    function removeProjectFromState(projectId: number) {
        setProjects((currentProjects) =>
            currentProjects.filter((project) => project.id !== projectId)
        );

        setSelectedProject((currentProject) =>
            currentProject?.id === projectId ? null : currentProject
        );
    }

    function addTaskToSelectedProject(task: TaskResponse) {
        setSelectedProject((currentProject) => {
            if (!currentProject) {
                return currentProject;
            }

            return {
                ...currentProject,
                taskCount: currentProject.taskCount + 1,
                tasks: [...currentProject.tasks, task],
            };
        });

        setProjects((currentProjects) =>
            currentProjects.map((project) =>
                project.id === task.projectId
                    ? {
                        ...project,
                        taskCount: project.taskCount + 1,
                        tasks: [...project.tasks, task],
                    }
                    : project
            )
        );
    }

    function removeTaskFromSelectedProject(task: TaskResponse) {
        setSelectedProject((currentProject) => {
            if (!currentProject) {
                return currentProject;
            }

            return {
                ...currentProject,
                taskCount: Math.max(currentProject.taskCount - 1, 0),
                tasks: currentProject.tasks.filter(
                    (currentTask) => currentTask.id !== task.id
                ),
            };
        });

        setProjects((currentProjects) =>
            currentProjects.map((project) =>
                project.id === task.projectId
                    ? {
                        ...project,
                        taskCount: Math.max(project.taskCount - 1, 0),
                        tasks: project.tasks.filter(
                            (currentTask) => currentTask.id !== task.id
                        ),
                    }
                    : project
            )
        );
    }

    function clearProjects() {
        setProjects([]);
        setSelectedProject(null);
        setHasLoadedProjects(false);
    }

    return (
        <ProjectContext.Provider
            value={{
                projects,
                selectedProject,
                hasLoadedProjects,
                selectedTask,
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
