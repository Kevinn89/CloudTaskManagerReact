import { useState } from 'react';


import { useNavigate } from "react-router-dom";

// import { useProjects } from "../context/ProjectContext";
import { AppPaths } from '../routes/Route';
import { deleteTask, updateTask } from '../services/TaskService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeTaskFromSelectedProject } from '../store/ProjectSlice';



function EditTaskPage() {

    const dispatch = useAppDispatch();

    const selectedTask = useAppSelector(state => state.project.selectedTask);

    if (!selectedTask)
        return <>No task</>

    const { title, description, id, projectId, priority, taskStatus, dueDate } = selectedTask

    const task = selectedTask;

    const navigate = useNavigate();


    const [form, setForm] = useState({
        id: id,
        projectId: projectId,
        title: title,
        description: description,
        taskStatus: taskStatus,
        priority: priority,
        dueDate: dueDate

    })

    async function removeTask() {

        await deleteTask(id, projectId).catch(error => console.log(error))
        dispatch(removeTaskFromSelectedProject(task));
        navigate(`/projects/${projectId}/edit`);
    }


    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await updateTask({
            id: id,
            projectId: form.projectId,
            title: form.title,
            description: form.description,
            taskStatus: form.taskStatus,
            priority: form.priority,
            dueDate: form.dueDate
        }).catch(error => console.log(error))

        navigate(AppPaths.editProject(projectId));
    }


    function handleChangeAll(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>): void {

        const { name, value } = event.target;

        setForm((forms) => ({

            ...forms,
            [name]: value

        }))
    }


    function handleChangeAl(event: React.ChangeEvent<HTMLSelectElement>): void {

        const { name, value } = event.target;

        setForm((forms) => ({

            ...forms,
            [name]: value

        }))
    }
    return (
        <>
            <form onSubmit={onSubmit}>
                <div>
                    <label>
                        Task Title:
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChangeAll}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChangeAll}
                            maxLength={500}
                            rows={10}
                            style={{
                                width: "100%",
                                height: "120px",
                                resize: "none",
                            }}
                        />
                    </label>
                </div>

                <><div>
                    <label>
                        Pick Task Priority status:
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleChangeAl}
                        >
                            <option value="">Select priority</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </label>
                </div>

                    <div>
                        <label>
                            Pick Task status:
                            <select
                                name="taskStatus"
                                value={form.taskStatus}
                                onChange={handleChangeAl}
                            >
                                <option value="">Select Project status</option>
                                <option value="TODO">TODO</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="DONE">DONE</option>
                            </select>
                        </label>
                    </div></>

                <button type="submit">Update</button>
                <button type="button" style={{ margin: "20px" }} onClick={removeTask}>
                    Delete
                </button>
                <button type="button" style={{ margin: "20px" }} onClick={() => navigate(AppPaths.editProject(projectId))}>
                    Back to Project
                </button>
            </form>
        </>
    );
}



export default EditTaskPage
