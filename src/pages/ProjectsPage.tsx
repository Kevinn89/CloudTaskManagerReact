import { useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectList from "../components/project/ProjectList";
import { useProjects } from "../context/ProjectContext";
import { getUserProjects } from "../services/ProjectService";
import { useAuth } from "../context/AuthContext";
import { AppPaths } from "../routes/Route";


function ProjectsPage() {

  const { user } = useAuth()

  const canCreate = user?.privileges.includes("CREATE") === true;

  const { setProjects, projects } = useProjects();

  useEffect(() => {

    async function loadProjects() {
      const proj = await getUserProjects();

      console.log(proj)
      setProjects(proj);
    }

    loadProjects();

  }, [])

  async function getProject() {


    const proj = await getUserProjects();


    console.log(proj)



  }

  return (
    <main>
      <section>
        <Link to={AppPaths.home()}>home</Link>
        <h1>Projects</h1>
        <p>View and manage your active projects.</p>
        {
          canCreate ? <div>
            <Link to="/create-project">Create Project</Link>
          </div> : <></>
        }
        {/* <button type="button" onClick={getProject} >test projects</button> */}
        <ProjectList projects={projects} />
      </section>
    </main>
  );
}

export default ProjectsPage;



