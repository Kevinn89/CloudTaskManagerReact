import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";
import { useAuth } from "../context/AuthContext";
import { AppPaths } from "../routes/Route";


function LoginPage() {

  const { login } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""

  })


  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((forms) => ({
      ...forms,
      [name]: value
    }));
  }

  async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {

    event.preventDefault();

    try {

      const authResponse = await loginUser({
        email: form.email,
        password: form.password,
      });

      const user = authResponse;

      console.log(user)


      user.email = form.email;
      login(user);
      navigate(AppPaths.home())

    }
    catch (errors) {
      console.error("Login failed", errors);

    }

  }


  return (
    <section>
      <h1>Sign in</h1>
      <p>Access your projects and tasks.</p>
      <form onSubmit={onSubmit} style={{ marginTop: "10px", justifyItems: "center" }}>

        <input type="email" placeholder="Enter Email" style={{ display: "flex", flexDirection: "column", marginTop: "15px" }} name="email" value={form.email} onChange={onChange} />
        <input type="password" placeholder="Enter Password" style={{ display: "flex", flexDirection: "column", marginTop: "15px" }} name="password" value={form.password} onChange={onChange} />
        <button type="submit" style={{ display: "flex", flexDirection: "column", marginTop: "15px" }}>Submit</button>

      </form>
      <div style={{ marginTop: "20px" }}>
        <p><strong>Have you Registered? <button type="button" onClick={() => navigate(AppPaths.register())}>Register</button> </strong></p>
      </div>

    </section>
  );
}

export default LoginPage;

