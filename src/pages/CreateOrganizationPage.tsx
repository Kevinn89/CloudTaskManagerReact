import React, { useState } from 'react'
import { createOrganziation } from '../services/OrgService';
import { useNavigate } from 'react-router-dom';
import { AppPaths } from '../routes/Route';
import { addOrg } from '../store/OrgSlice';
import { useAppDispatch } from '../store/hooks';

function CreateOrganizationPage() {

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [form, setForm] = useState({
        id: 0,
        name: "",
        description: "",
    })

    function resetForm() {
        setForm({
            id: 0,
            name: " ",
            description: " "
        });
    }


    async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {

        event.preventDefault();

        try {

            const response = await createOrganziation({
                name: form.name,
                description: form.description
            })

            console.log(response)
            dispatch(addOrg(response));

        }
        catch (error) {
            console.log(error)
        }
        resetForm();

        navigate(AppPaths.organizations())

    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {

        const { name, value, type } = event.target;

        setForm((forms) => ({

            ...forms,
            [name]: type === "number" ? Number(value) : value

        }))

    }


    function handleChangeTextArea(event: React.ChangeEvent<HTMLTextAreaElement>): void {

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
                        Organization Name:
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={form.description}
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
                <button type="submit"> Create </button>
                {/* <button type="button" style={{ margin: "20px" }} onClick={removeTask}>
                    Delete
                </button> */}
                <button type="button" style={{ margin: "20px" }} onClick={() => navigate(AppPaths.organizations())}>
                    My Organizations
                </button>
            </form>
        </>
    )
}

export default CreateOrganizationPage
