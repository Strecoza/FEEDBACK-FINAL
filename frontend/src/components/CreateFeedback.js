import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as api from "../services/api";

const CreateFeedback = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            await api.createFeedback({ title, description }, token);
            if (location.state?.refreshDashboard) {
                location.state.refreshDashboard();
            }
            navigate("/dashboard");
        } catch (err) {
            console.error("Error creating feedback:", err);
            setError("Failed to create feedback. Please try again.");
        } finally { setLoading(false)}
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Create Feedback</h2>

            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}
                       required></textarea>
                </div>
                <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Creating..." : "Submit Feedback"}
                </button>
            </form>
     </div>
    );
};

export default CreateFeedback;