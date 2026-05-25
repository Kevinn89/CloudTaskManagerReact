import { useNavigate } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { type TaskResponse } from "../../services/TaskService";
import "./Task.css";
type TaskProps = {
    task: TaskResponse;
}

function Task({ task }: TaskProps) {

    const { title, description, id, projectId, dueDate, completionDate, priority, taskStatus, createdAt } = task

    const { setSelectedTask } = useProjects();

    const navigate = useNavigate();

    function onClick() {
        setSelectedTask(task);
        navigate(`/task/${task.id}/edit`);
    }

    return (
        <>
            <div className="task-box">
                <p>Task id: {id}</p>
                <p>Project id: {projectId}</p>
                <p>Task name: {title}</p>
                <p>Task description: {description}</p>
                {/* <p>Task due date: {dueDate}</p> */}
                {/* <p>Task completion date: {completionDate}</p> */}

                <p>Task priority: {priority}</p>
                <p>Task status: {taskStatus}</p>
                <p>Task created at: {createdAt}</p>
                <button type="button" onClick={onClick}>
                    Edit Task
                </button>

            </div>
        </>
    );
}

export default Task
