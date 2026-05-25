import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { register } from "../services/AuthService";

function RegisterPage() {


  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { name, value } = event.target;

    setForm((forms) => ({
      ...forms,
      [name]: value
    }));
  }

  async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {

    event.preventDefault();

    const response = await register({
      name: form.name,
      email: form.email,
      password: form.password
    });

    const data = response
    console.log(data);

    navigate("/login")

  }

  return (
    <section>
      <h1>Create account</h1>
      <p>Set up an account to start managing your cloud tasks.</p>
      <form onSubmit={onSubmit} >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px", marginLeft: "400px", marginRight: "400px" }}>
          <input type="text" name="name" placeholder="Enter Name" value={form.name} onChange={onChange} />
          <input type="email" name="email" placeholder="Enter Email" value={form.email} onChange={onChange} />
          <input type="password" name="password" placeholder="Enter Password" value={form.password} onChange={onChange} />
          <button type="submit">Register </button>
        </div>
      </form>
      <div>
        <p><strong>Are you already a memeber? <button type="button" onClick={() => navigate("/login")}>Login</button> </strong></p>
      </div>
    </section>
  );
}

export default RegisterPage;
