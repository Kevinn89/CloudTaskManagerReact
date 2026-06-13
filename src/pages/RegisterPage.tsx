import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { register } from "../services/AuthService";
import { AppPaths } from "../routes/Route";

function RegisterPage() {


  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    accountType: ""
  });

  function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    event.preventDefault();
    const { name, value } = event.target;

    setForm((forms) => ({
      ...forms,
      [name]: value
    }));
  }

  async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {

    event.preventDefault();

    console.log(form);

    const response = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      accountType: form.accountType
    });

    const data = response
    console.log(data);

    navigate(AppPaths.login())

  }

  return (
    <section>
      <h1>Create account</h1>
      <p>Set up an account to start managing your cloud tasks.</p>
      <form onSubmit={onSubmit} >
        <input type="text" name="name" placeholder="Enter Name" value={form.name} onChange={onChange} />
        <input type="email" name="email" placeholder="Enter Email" value={form.email} onChange={onChange} />
        <input type="password" name="password" placeholder="Enter Password" value={form.password} onChange={onChange} />
        <div>
          <select
            name="accountType"
            value={form.accountType}
            onChange={onChange}
          >
            <option value="">Select Account Type</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: "15px" }}>Register </button>
      </form>
      <div>
        <p><strong>Are you already a memeber? <button type="button" style={{ marginTop: "5px" }} onClick={() => navigate(AppPaths.login())}>Login</button> </strong></p>
      </div>
    </section>
  );
}

export default RegisterPage;
