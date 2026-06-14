import React, { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import "../layout/createPage.css";
import { createProject } from '../services/ProjectService';
import { AppPaths } from '../routes/Route';
import { useAppSelector } from '../store/hooks';

function CreateProjectPage() {


    const user = useAppSelector(state => state.auth.user);


    const canCreate = user?.privileges.includes("CREATE") === true;

    if (!user)
        throw new Error("No User")

    const navigate = useNavigate()

    const [form, setForm] = useState({
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

        console.log("made it here")

        await createProject({
            name: form.name,
            description: form.description
        }).catch(error => console.log(error));

        navigate(AppPaths.projects())
    }
    return (

        <div className='createPage'>
            <div> <h2>Create a project</h2 >

                <div className='create-project-input'>

                    <form onSubmit={onSubmit} >
                        <div>
                            <h2>Choose a Project Name</h2>
                            <input type="text" name="name" value={form.name} placeholder="Project Name" onChange={handleChange} />
                        </div>
                        <div>
                            <h2>Choose a Project Description</h2>
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
                            </div> :
                                <></>
                        }
                        {/* <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
                            <button style={{ width: "75px", marginBottom: "10px" }} type="submit">Create</button>
                        </div> */}

                    </form>
                </div>
                <button style={{ width: "100px" }} type="button" onClick={() => navigate(AppPaths.projects())}>My Projects</button>
            </div>
        </div>
    )
}

export default CreateProjectPage
