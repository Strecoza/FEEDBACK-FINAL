import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthPage from "./components/AuthPage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import CreateFeedback from "./components/CreateFeedback";
import FeedbackForm from "./components/FeedbackForm";
import AllFeedbacks from "./components/AllFeedbacks";
import Comments from "./components/Comments";

function PrivateRoute({ element }) {
    return localStorage.getItem("token") ? element : <Navigate to="/" />;
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                <Route path="/create-feedback" element={<PrivateRoute element={<CreateFeedback />} />} />
                <Route path="/all-feedbacks" element={<PrivateRoute element={<AllFeedbacks />} />} />
                <Route path="/comments/:feedbackId" element={<PrivateRoute element={<Comments />} />} />
                <Route path="/feedback-form" element={<PrivateRoute element={<FeedbackForm />} />} />
            </Routes>
        </Router>
    );
}

export default App;