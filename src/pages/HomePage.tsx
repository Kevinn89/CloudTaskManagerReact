import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/AuthService";
import { useAuth } from "../context/AuthContext";


export default function HomePage() {

  const navigate = useNavigate();
  const { logout, user } = useAuth();

  async function onClick() {
    const refreshToken = user?.refreshToken;

    if (!refreshToken) {
      return;
    }

    await logoutUser({
      refreshToken: refreshToken
    });

    console.log("at logout")
    logout();

    navigate("/login")

  }

  return (
    <main>
      <section>
        <h1>Cloud Task Manager</h1>
        <p>Hello {user?.email} track your projects, organize tasks, and keep cloud work moving.</p>
        <Link to="/projects">projects</Link>
        <div> <button type="button" onClick={onClick}>Sign-out</button> </div>
      </section>
    </main>
  );
}


