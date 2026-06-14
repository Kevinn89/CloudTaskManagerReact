import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/AuthService";
import { useOrgs } from "../context/OrgContext";
import { AppPaths } from "../routes/Route";
import { useAppDispatch, useAppSelector } from "../store/hooks";


export default function HomePage() {

  const navigate = useNavigate();

  const user = useAppSelector(state => state.auth.user);

  const dispatch = useAppDispatch();


  const { clearOrgs } = useOrgs();
  const org_link = <Link to={AppPaths.organizations()}>organizations</Link>;

  async function onClick() {

    const response = await logoutUser().catch(error => console.log(error));

    console.log(response)
    clearOrgs();

    dispatch(logoutUser);


    navigate(AppPaths.login())
  }

  return (
    <main>
      <section>
        <h1>Cloud Task Manager</h1>
        <p>Hello {user?.email} track your projects, organize tasks, and keep cloud work moving.</p>
        <Link to={AppPaths.projects()}>projects</Link>
        {
          user?.privileges.map(priv => priv === "CREATE") ? org_link : <></>
        }
        <div> <button type="button" onClick={onClick}>Sign-out</button> </div>
      </section>
    </main>
  );
}




