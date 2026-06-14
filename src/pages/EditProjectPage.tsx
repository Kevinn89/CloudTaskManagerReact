import React, { useEffect, useState, type ChangeEvent } from 'react';
import { deleteProject, getProject, updateProject } from '../services/ProjectService';


import { useNavigate, useParams } from "react-router-dom";

import TaskList from '../components/task/TaskList';
import { AppPaths } from '../routes/Route';
import { getProjectTasks, type TaskResponse } from '../services/TaskService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeProjectFromState, setProjects, setSelectedProject, updateProjectInState } from "../store/ProjectSlice";


type ProjectForm = {
    id: number;
    name: string;
    description: string;
    task_count: number;
    projectStatus: string;
    priorityStatus: string;
    updated_date: string;
    creation_date: string;
    tasks: TaskResponse[];
};

function EditProjectsPage() {

    const { projectId } = useParams()

    const user = useAppSelector(state => state.auth.user);

    const canDELETE = user?.privileges.includes("DELETE");
    const canCreate = user?.privileges.includes("CREATE");
    const editable = false
    const navigate = useNavigate()
    const dispatch = useAppDispatch();


    if (!user)
        return "No User"


    const selectedProject = useAppSelector(state => state.project.selectedProject);

    //  const { selectedProject, updateProjectInState, removeProjectFromState, setSelectedProject } = useProjects();

    const [taskList, setTaskList] = useState<TaskResponse[]>([])

    const [form, setForm] = useState<ProjectForm>({
        id: 0,
        name: "",
        description: "",
        task_count: 0,
        projectStatus: "",
        priorityStatus: "",
        updated_date: "",
        creation_date: "",
        tasks: [],
    });


    useEffect(() => {

        console.log(projectId)
        async function getMyProject() {


            const project =
                selectedProject !== null && selectedProject.id === Number(projectId)
                    ? selectedProject
                    : await getProject(Number(projectId));

            const { id, name, description, taskCount, status, priority, createdAt, updatedAt, tasks } = project

            setForm({
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

            dispatch(setSelectedProject(project));
        }
        async function getMyTask() {
            const list = await getProjectTasks(Number(projectId)).catch(error => console.log(error))
            console.log(list)
            if (!list)
                return
            setTaskList(list);
        }

        getMyTask();
        getMyProject();

    }, [projectId, selectedProject])

    async function removeProject() {


        //  console.log(id)

        await deleteProject(
            Number(projectId)
        ).catch(error => console.log(error))

        dispatch(removeProjectFromState(Number(projectId)));
        navigate(AppPaths.projects())

    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        console.log(form)

        const updatedProject = await updateProject({
            projectId: form.id,
            name: form.name,
            description: form.description,
            projectStatus: form.projectStatus,
            priorityStatus: form.priorityStatus
        }).catch(error => console.log(error))

        console.log(updatedProject)

        if (!updatedProject) {
            throw new Error(`No Update for Project ${form.name}`)
        }

        dispatch(updateProjectInState(updatedProject));

        navigate(AppPaths.projects())
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>): void {

        const { name, value, type } = event.target;

        setForm((forms) => ({

            ...forms,
            [name]: type === "number" ? Number(value) : value

        }))

    }
    function addTask() {

        navigate(AppPaths.createTask(Number(projectId)));
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
            <p>Project ID number: {Number(projectId)}</p>

            <form onSubmit={onSubmit}>
                <div>
                    <label>
                        Project Name Change:
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
                        Project Description Change:
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
                            <option value="NOT_ACTIVE">NOT_ACTIVE</option>
                        </select>
                    </label>
                </div>

                <button type="submit">Update</button>
                {

                    canDELETE ? <button type="button" style={{ margin: "20px" }} onClick={removeProject}>
                        Delete
                    </button> : <></>

                }
                {
                    canCreate ? <button type="button" onClick={addTask}>
                        Add Task
                    </button> : <></>
                }
                <button type="button" style={{ margin: "20px" }} onClick={() => navigate(AppPaths.projects())}>
                    My Projects
                </button>
            </form>


            <div style={{ display: 'flex', justifyContent: 'center' }}><TaskList tasks={taskList} editable={editable} /></div>

        </div>
    )
}

export default EditProjectsPage
