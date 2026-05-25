import type { ProjectResponse } from "../../services/ProjectService";
import Project from "./Project";

type ProjectListProps =
    {
        projects: ProjectResponse[];
    }

function ProjectList({ projects }: ProjectListProps) {


    return (
        <div>
            {
                projects.length === 0 ? <p>No Projects</p> : projects.map((project, indx) => {
                    return <Project key={(indx)} project={project} />;
                })
            }
        </div>
    )
}

export default ProjectList
