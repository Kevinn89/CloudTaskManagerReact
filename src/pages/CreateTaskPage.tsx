import React, { useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../layout/createPage.css";
import { createTask } from '../services/TaskService';
import { AppPaths } from '../routes/Route';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addTaskToSelectedProject, setSelectedProjectId } from "../store/ProjectSlice";

function CreateTaskPage() {

    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.auth.user);

    const canCreate = user?.privileges.includes("CREATE");

    const { projectId } = useParams();
    const selectedProjectId = Number(projectId);
    const navigate = useNavigate()

    const [form, setForm] = useState({
        id: selectedProjectId,
        name: "",
        description: "",
        status: "",
        priority: ""
    })

    if (!projectId || Number.isNaN(selectedProjectId))
        return <>No Project</>


    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        event.preventDefault();

        const { name, value } = event.target;

        setForm((forms) => ({

            ...forms,
            [name]: value

        }))

    }

    async function onSubmit(event: React.ChangeEvent<HTMLFormElement>) {

        event.preventDefault();

        const response = await createTask({
            projectId: form.id,
            title: form.name,
            description: form.description
        }).catch(error => console.log(error));

        if (response) {
            dispatch(addTaskToSelectedProject(response))
            dispatch(setSelectedProjectId(response.projectId))
        }

        if (selectedProjectId)
            navigate(AppPaths.editProject(selectedProjectId))
    }
    return (

        <div className='createPage'>
            <div> <h2>Create a Task</h2 >

                <div className='create-task-input'>

                    <form onSubmit={onSubmit} >
                        <div>
                            <h2>Choose a Task title</h2>
                            <input type="text" name="name" value={form.name} placeholder="Task Name" onChange={handleChange} />
                        </div>
                        <div>
                            <h2>Describe Task</h2>
                            <textarea name="description"
                                value={form.description}
                                onChange={handleChange}
                                maxLength={500}
                                rows={10}
                                style={{
                                    width: "100%",
                                    height: "120px",
                                    resize: "none",
                                }} />
                        </div>
                        {

                            canCreate ? <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
                                <button style={{ width: "75px", marginBottom: "10px" }} type="submit">Create</button>
                            </div> : <></>
                        }

                    </form>
                </div>
                <button type="button" style={{ margin: "20px" }} onClick={() => navigate(AppPaths.editProject(selectedProjectId))}>
                    Back to Project
                </button>
            </div>
        </div>
    )
}

export default CreateTaskPage
