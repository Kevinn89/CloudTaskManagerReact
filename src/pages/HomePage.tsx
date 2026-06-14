import { Link, useNavigate } from "react-router-dom";
import { logoutUser as logoutUserRequest } from "../services/AuthService";
import { AppPaths } from "../routes/Route";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutUser } from "../store/AuthSlice";
import { persistor } from "../store/Store";
import { clearOrgs } from "../store/OrgSlice";


export default function HomePage() {

  const navigate = useNavigate();

  const user = useAppSelector(state => state.auth.user);

  const dispatch = useAppDispatch();

  async function onClick() {

    const response = await logoutUserRequest().catch(error => console.log(error));

    console.log(response)
    dispatch(clearOrgs());

    dispatch(logoutUser());
    await persistor.flush();
    await persistor.purge();

    navigate(AppPaths.login())
  }

  return (
    <main>
      <section>
        <h1>Cloud Task Manager</h1>
        <p>Hello {user?.email} track your projects, organize tasks, and keep cloud work moving.</p>
        <Link to={AppPaths.projects()}>projects</Link>
        {
          user?.privileges?.includes("CREATE") ? <Link to={AppPaths.organizations()}>organizations</Link> : <></>
        }
        <div> <button type="button" onClick={onClick}>Sign-out</button> </div>
      </section>
    </main>
  );
}
