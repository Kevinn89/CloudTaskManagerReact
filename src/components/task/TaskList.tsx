import type { TaskResponse } from '../../services/TaskService';
import Task from './Task';

type TaskListProps =
    {
        tasks: TaskResponse[];
    }

function TaskList({ tasks }: TaskListProps) {

    return (

        <div style={{ background: "black", width: "500px" }}>
            {
                tasks.map((task) => {
                    return <Task key={task.id} task={task} />;
                })
            }
        </div>
    )
}

export default TaskList
