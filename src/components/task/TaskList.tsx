import type { TaskResponse } from '../../services/TaskService';
import Task from './Task';
import "./Task.css";

type TaskListProps =
    {
        tasks: TaskResponse[];
        editable: boolean
    }

function TaskList({ tasks, editable }: TaskListProps) {

    return (

        <div className="task-list">
            {
                tasks.length === 0 ? (
                    <div className="task-empty">
                        <p className="task-empty__title">No tasks yet</p>
                        <p className="task-empty__copy">Tasks for this project will appear here.</p>
                    </div>
                ) : tasks.map((task) => {
                    return <Task key={task.id} task={task} enableEdit={editable} />;
                })
            }
        </div>
    )
}

export default TaskList
