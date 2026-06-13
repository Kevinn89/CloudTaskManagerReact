import { useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectList from "../components/project/ProjectList";
import { useAuth } from "../context/AuthContext";
import { AppPaths } from "../routes/Route";
import { getUserProjects } from "../services/ProjectService";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setProjects } from "../store/ProjectSlice";



function ProjectsPage() {

  const { user } = useAuth()

  const canCreate = user?.privileges.includes("CREATE");
  const dispatch = useAppDispatch();
  const projects = useAppSelector(state => state.project.projects);

  useEffect(() => {

    async function loadProjects() {
      const proj = await getUserProjects();

      console.log(proj)

      dispatch(setProjects(proj));
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



