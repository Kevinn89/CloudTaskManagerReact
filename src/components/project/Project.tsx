import { useNavigate } from "react-router-dom";
import type { ProjectResponse } from '../../services/ProjectService';
// import "../../layout/createPage.css";
import { useProjects } from "../../context/ProjectContext";
import "/src/components/project/Project.css";


type ProjectProps =
    {
        project: ProjectResponse;
    }

function Project({ project }: ProjectProps) {

    const navigate = useNavigate();

    const { setSelectedProject, selectedProject } = useProjects();

    function onClick() {

        console.log(project)

        setSelectedProject(project)

        console.log(selectedProject)

        navigate(`/projects/${project.id}/edit`, {
        });
    }

    const { id, name, description, taskCount, createdAt, updatedAt, status, priority } = project;

    return (
        <div className='project-card-wrapper'>
            <div className="project-card">
                <p><strong>Project identification number:</strong> {id}</p>
                <p><strong>Project Name:</strong> {name}</p>
                <p><strong>Project Description:</strong> {description}</p>
                <p><strong>Project Task Count:</strong> {taskCount}</p>
                <p><strong>Project Created on:</strong> {createdAt}</p>
                <p><strong>Project Status:</strong> {status}</p>
                <p><strong>Project Priority:</strong> {priority}</p>

                {
                    updatedAt === null ? "" : <p><strong>Project Last Updated:</strong> {updatedAt}</p>

                }
                <button className="button" type="button" onClick={onClick}>Edit</button>
            </div>

        </div>
    )
}


export default Project
