import { useNavigate } from "react-router-dom";
import { type TaskResponse } from "../../services/TaskService";
import { setSelectedTask } from "../../store/ProjectSlice";
import "./Task.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";



type TaskProps = {
    task: TaskResponse;
    enableEdit: boolean
}

function Task({ task, enableEdit }: TaskProps) {


    const user = useAppSelector(state => state.auth.user);
    const dispatch = useAppDispatch();


    if (!user)
        throw new Error("No User")

    const { title, description, id, projectId, dueDate, completionDate, priority, taskStatus, createdAt } = task

    const navigate = useNavigate();

    function onClick() {
        console.log(task)

        dispatch(setSelectedTask(task));
        navigate(`/task/${task.id}/edit`);
    }

    const initials = title
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
        <article className="task-card">
            <div className="task-card__header">
                <div className="task-card__avatar" aria-hidden="true">
                    {initials || "T"}
                </div>
                <div>
                    <p className="task-card__eyebrow">Task #{id} / Project #{projectId}</p>
                    <h2 className="task-card__title">{title}</h2>
                </div>
            </div>

            <p className="task-card__description">
                {description || "No description has been added for this task."}
            </p>

            <div className="task-card__badges" aria-label="Task status and priority">
                <span className={`task-card__badge task-card__badge--${taskStatus.toLowerCase()}`}>
                    {taskStatus.replace("_", " ")}
                </span>
                <span className={`task-card__badge task-card__badge--${priority.toLowerCase()}`}>
                    {priority} priority
                </span>
            </div>

            <div className="task-card__meta" aria-label="Task details">
                <div className="task-card__stat">
                    <span>{formatDate(createdAt)}</span>
                    <small>Created</small>
                </div>
                {
                    dueDate ? (
                        <div className="task-card__stat">
                            <span>{formatDate(dueDate)}</span>
                            <small>Due</small>
                        </div>
                    ) : <></>
                }
                {
                    completionDate ? (
                        <div className="task-card__stat">
                            <span>{formatDate(completionDate)}</span>
                            <small>Completed</small>
                        </div>
                    ) : <></>
                }
            </div>

            {
                enableEdit ? (
                    <div className="task-card__actions">
                        <button type="button" onClick={onClick}>
                            Edit Task
                        </button>
                    </div>
                ) : <></>
            }
        </article>
    );
}

export default Task
