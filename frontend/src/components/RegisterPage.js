import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {registerUser} from "../services/api";

function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ username, email, password });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input className="form-control mb-2" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input id="email" className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input id= "password" className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-primary w-100" type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;