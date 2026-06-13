import { useNavigate } from "react-router-dom";
import type { ProjectResponse } from '../../services/ProjectService';
import "/src/components/project/Project.css";
import { useAuth } from "../../context/AuthContext";
import { setSelectedProject } from "../../store/ProjectSlice";
import { useAppDispatch } from "../../store/hooks";


type ProjectProps =
    {
        project: ProjectResponse;
    }

function Project({ project }: ProjectProps) {


    const { user } = useAuth()

    const canCreate = user?.privileges.includes("CREATE") === true;

    const navigate = useNavigate();

    const dispatch = useAppDispatch();



    // const { setSelectedProject } = useProjects();

    function onClick() {

        dispatch(setSelectedProject(project))

        const projectId = project.id;

        navigate(`/projects/${projectId}/edit`, {
        });
    }

    function goToTasks() {

        setSelectedProject(project)

        const projectId = project.id;

        navigate(`/projects/${projectId}/task`)
    }


    const { id, name, description, taskCount, createdAt, updatedAt, status, priority } = project;
    const initials = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();

    function formatDate(value: string) {
        const date = new Date(value);

        return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
    }

    return (
        <article className='project-card'>
            <div className="project-card__header">
                <div className="project-card__avatar" aria-hidden="true">
                    {initials || "P"}
                </div>
                <div>
                    <p className="project-card__eyebrow">Project #{id}</p>
                    <h2 className="project-card__title">{name}</h2>
                </div>
            </div>

            <p className="project-card__description">
                {description || "No description has been added for this project."}
            </p>

            <div className="project-card__badges" aria-label="Project status and priority">
                <span className={`project-card__badge project-card__badge--${status.toLowerCase()}`}>
                    {status}
                </span>
                <span className={`project-card__badge project-card__badge--${priority.toLowerCase()}`}>
                    {priority} priority
                </span>
            </div>

            <div className="project-card__meta" aria-label="Project details">
                <div className="project-card__stat">
                    <span>{taskCount}</span>
                    <small>{taskCount === 1 ? "Task" : "Tasks"}</small>
                </div>
                <div className="project-card__stat">
                    <span>{formatDate(createdAt)}</span>
                    <small>Created</small>
                </div>
                {
                    updatedAt ? (
                        <div className="project-card__stat">
                            <span>{formatDate(updatedAt)}</span>
                            <small>Updated</small>
                        </div>
                    ) : <></>
                }
            </div>

            <div className="project-card__actions">
                {
                    canCreate ? <button className="button" type="button" onClick={onClick}>Edit</button> : <></>
                }
                {
                    taskCount > 0 ? <button className="button" type="button" onClick={goToTasks}>Tasks</button> : <></>
                }
            </div>
        </article>
    )
}


export default Project
