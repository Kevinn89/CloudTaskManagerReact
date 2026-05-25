import { useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectList from "../components/project/ProjectList";
import { useProjects } from "../context/ProjectContext";
import { getUserProjects } from "../services/ProjectService";


function ProjectsPage() {

  // const [projects, setProjects] = useState<ProjectResponse[]>([])
  const { setProjects, projects } = useProjects();

  useEffect(() => {

    async function loadProjects() {
      const proj = await getUserProjects();

      console.log(proj)
      setProjects(proj);
    }

    loadProjects();

  }, [])

  return (
    <main>
      <section>
        <Link to="/home">home</Link>
        <h1>Projects</h1>
        <p>View and manage your active projects.</p>
        <div>
          <Link to="/create-project">Create Project</Link>
        </div>
        <ProjectList projects={projects} />
      </section>
    </main>
  );
}

export default ProjectsPage;



