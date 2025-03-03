import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as api from "../services/api";

function Dashboard() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const location = useLocation();

    const refresh = location.state?.refresh||false;

    const fetchFeedbacks = useCallback(async () => {
        if (!token) return;
        try {
            const userResponse = await api.getCurrentUser(token);
            const userId = userResponse.data.userId;
    
            const feedbackResponse = await api.getAllFeedbacks();
            console.log("Dashboard - Feedback Response:", feedbackResponse); 
    
            if (!feedbackResponse || !feedbackResponse.feedbacks) {
                throw new Error("Invalid response format");
            }
            
            setFeedbacks(feedbackResponse.feedbacks.filter(fb => fb.createdBy === userId));
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            setFeedbacks([]);
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
    }, [token, navigate, fetchFeedbacks, refresh]);

    const handleCreate = () => {
        navigate("/create-feedback", { state: { refreshDashboard: true } });
    };

    return (
        <div className="container mt-4 flex flex-col min-h-screen">
            <div className="d-flex justify-content-between mb-3">
                 <button className="btn btn-primary" onClick={() => navigate("/all-feedbacks")}>SEE ALL FEEDBACKS</button>
                <button className="btn btn-danger" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
                    LOGOUT
                </button>
            </div>
            <div className="text-center mb-3">
                <button className="btn btn-success" onClick={handleCreate}>CREATE FEEDBACK</button>
            </div>

            {loading ? (
                <p className="text-center mt-5">Loading..</p>
            ) : feedbacks.length > 0 ? (
                feedbacks.map((fb) => (
                    <div key={fb._id} className="card p-3 mb-2">
                        <h3>{fb.title}</h3>
                        <p>{fb.description}</p>
                        <button className="btn btn-outline-secondary" disabled>
                            Upvote ({fb.votes})
                        </button>
                        <button className="btn btn-warning mx-2" onClick={() => navigate(`/edit-feedback/${fb._id}`)}>EDIT</button>
                        <button className="btn btn-danger" onClick={async () => {
                            await api.deleteFeedback(fb._id);
                            fetchFeedbacks(); 
                        }}>DELETE</button>
                    </div>
                ))
            ) : (<p className="text-center mt-5">No feedbacks yet</p> )}
        </div>
    );
}

export default Dashboard;