import React, { useEffect, useState, type ChangeEvent } from 'react';
import { deleteProject, updateProject } from '../services/ProjectService';


import { useNavigate } from "react-router-dom";

import TaskList from '../components/task/TaskList';
import { useProjects } from "../context/ProjectContext";
import { getProjectTasks, type TaskResponse } from '../services/TaskService';



function EditProjectsPage() {

    const { selectedProject, updateProjectInState, removeProjectFromState } = useProjects();
    const navigate = useNavigate()


    if (!selectedProject) {

        return <p>No project selected.</p>;
    }



    const { id, name, description, taskCount, status, priority, createdAt, updatedAt, tasks } = selectedProject
    const [taskList, setTaskList] = useState<TaskResponse[]>([])
    const [form, setForm] = useState({
        id: id,
        name: name,
        description: description,
        task_count: taskCount,
        projectStatus: status,
        priorityStatus: priority,
        updated_date: updatedAt,
        creation_date: createdAt,
        tasks: tasks
    })


    useEffect(() => {
        setTaskList(selectedProject.tasks);
    }, [selectedProject.tasks])

    useEffect(() => {

        async function getMyTask() {
            const list = await getProjectTasks(id).catch(error => console.log(error))

            if (!list)
                return
            setTaskList(list);
        }
        getMyTask();

    }, [id])

    async function removeProject() {

        await deleteProject(
            id
        ).catch(error => console.log(error))

        removeProjectFromState(id);
        navigate("/projects")

    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await updateProject({
            projectId: form.id,
            name: form.name,
            description: form.description,
            projectStatus: form.projectStatus,
            priorityStatus: form.priorityStatus
        }).catch(error => console.log(error))


        updateProjectInState({
            id: form.id,
            name: form.name,
            description: form.description,
            taskCount: form.task_count,
            createdAt: form.creation_date,
            updatedAt: form.updated_date,
            status: form.projectStatus,
            priority: form.priorityStatus,
            tasks: form.tasks
        })
        navigate("/projects")
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>): void {

        const { name, value, type } = event.target;

        setForm((forms) => ({

            ...forms,
            [name]: type === "number" ? Number(value) : value

        }))

    }
    function addTask() {

        navigate(`/projects/${id}/create-task`, {
        });
    }

    function handleChangeTextArea(event: ChangeEvent<HTMLTextAreaElement>): void {

        const { name, value } = event.target;

        setForm((forms) => ({

            ...forms,
            [name]: value

        }))
    }

    function handleChangeDropDown(event: ChangeEvent<HTMLSelectElement>): void {

        const { name, value } = event.target;

        setForm((forms) => ({

            ...forms,
            [name]: value
        }))

    }


    return (
        <div>
            <p>Project ID number: {id}</p>

            <form onSubmit={onSubmit}>
                <div>
                    <label>
                        Project Name Change:
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Project Description Change:
                        <textarea
                            name="description"
                            value={description}
                            onChange={handleChangeTextArea}
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

                <div>
                    <label>
                        Pick Priority status:
                        <select
                            name="priorityStatus"
                            value={form.priorityStatus}
                            onChange={handleChangeDropDown}
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
                        Pick Project status:
                        <select
                            name="projectStatus"
                            value={form.projectStatus}
                            onChange={handleChangeDropDown}
                        >
                            <option value="">Select Project status</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="DELETED">CLOSED</option>
                            <option value="ARCHIVED">ARCHIVED</option>
                            <option value="NOT_ACTIVE">NOT_ACTIVE</option>
                        </select>
                    </label>
                </div>

                <button type="submit">Update</button>
                <button type="button" style={{ margin: "20px" }} onClick={removeProject}>
                    Delete
                </button>
                <button type="button" style={{ margin: "20px" }} onClick={() => navigate("/projects")}>
                    My Projects
                </button>
            </form>
            <button type="button" onClick={addTask}>
                Add Task
            </button>

            <div style={{ display: 'flex', justifyContent: 'center' }}><TaskList tasks={taskList} /></div>

        </div>
    )
}

export default EditProjectsPage
