import type { ProjectResponse } from "../../services/ProjectService";
import Project from "./Project";
import "/src/components/project/Project.css";

type ProjectListProps =
    {
        projects: ProjectResponse[];
    }

function ProjectList({ projects }: ProjectListProps) {


    return (
        <div className="project-list">
            {
                projects.length === 0 ? (
                    <div className="project-empty">
                        <p className="project-empty__title">No projects yet</p>
                        <p className="project-empty__copy">Projects you create or join will appear here.</p>
                    </div>
                ) : projects.map((project) => {
                    return <Project key={project.id} project={project} />;
                })
            }
        </div>
    )
}

export default ProjectList
