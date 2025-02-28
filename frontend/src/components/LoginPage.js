import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {loginUser} from "../services/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(email, password)
    try {
      
      const response = await loginUser({ email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input id = "email" className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input id = "password" className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-danger w-100" type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;