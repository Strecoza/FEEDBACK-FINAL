import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";

function Dashboard() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const fetchFeedbacks = useCallback(async () => {
        if (!token ) return;
        try {
            const userResponse = await api.getCurrentUser(token)
            const userId = userResponse.data.userId;

            const feedbackResponse = await api.getAllFeedbacks();
            if (feedbackResponse.data.feedbacks) {
                setFeedbacks(feedbackResponse.data.feedbacks.filter(fb => fb.createdBy === userId));
            }
        }catch (error) {
            console.error("Error fetching feedbacks:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            fetchFeedbacks();
        }
    }, [token, navigate, fetchFeedbacks]);

    const handleCreate = () => {
        navigate("/create-feedback", { state: { refreshDashboard: true } });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-danger" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
                    LOGOUT
                </button>
                <button className="btn btn-primary" onClick={() => navigate("/all-feedbacks")}>SEE ALL FEEDBACKS</button>
            </div>
            <div className="text-center mb-3">
                <button className="btn btn-success" onClick={handleCreate}>CREATE FEEDBACK</button>
            </div>

            {loading ? (
                <p className="text-center mt-5">Loading..</p>
            ) : feedbacks.length > 0 ? (
                feedbacks.map((fb) => (
                    <div key={fb._id || fb.id} className="card p-3 mb-2">
                        <h3>{fb.title}</h3>
                        <p>{fb.description}</p>
                        <button className="btn btn-outline-secondary" disabled>
                            Upvote ({fb.votes})
                        </button>
                        <button className="btn btn-warning mx-2" onClick={() => navigate(`/edit-feedback/${fb._id || fb.id}`)}>EDIT</button>
                        <button className="btn btn-danger" onClick={async () => {
                            await api.deleteFeedback(fb._id || fb.id, token);
                            fetchFeedbacks(); 
                        }}>DELETE</button>
                    </div>
                ))
            ) : (<p className="text-center mt-5">No feedbacks yet</p> )}
        </div>
    );
}

export default Dashboard;