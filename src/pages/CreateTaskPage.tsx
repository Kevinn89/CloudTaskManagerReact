import React, { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import "../layout/createPage.css";
import { createTask } from '../services/TaskService';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { AppPaths } from '../routes/Route';

function CreateTaskPage() {

    const { user } = useAuth()

    const canCreate = user?.privileges.includes("CREATE") === true;


    const { selectedProject } = useProjects();

    if (!selectedProject)
        return <>No Project</>

    const { id } = selectedProject;

    const navigate = useNavigate()

    const [form, setForm] = useState({
        id: id,
        name: "",
        description: "",
        status: "",
        priority: ""
    })


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

        await createTask({
            projectId: form.id,
            title: form.name,
            description: form.description
        }).catch(error => console.log(error));

        navigate(AppPaths.createTask(id))
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
                <button type="button" style={{ margin: "20px" }} onClick={() => navigate(AppPaths.editProject(id))}>
                    Back to Project
                </button>
            </div>
        </div>
    )
}

export default CreateTaskPage