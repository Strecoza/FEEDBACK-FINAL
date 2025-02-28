import React from "react";
import { useNavigate } from "react-router-dom";
import feedbackImg from "../assets/feedbackAuth.png"

function AuthPage() {
  const navigate = useNavigate();
  return (
    <div className="container text-center mt-5">
      <h1 className="text-primary">FEEDBACKS</h1>
      <img src={feedbackImg} alt="Feedback scene" className="my-3" width="400" />
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary mx-2" onClick={() => navigate("/register")}>REGISTER</button>
        <button className="btn btn-danger mx-2" onClick={() => navigate("/login")}>LOGIN</button>
      </div>
    </div>
  );
}

export default AuthPage;