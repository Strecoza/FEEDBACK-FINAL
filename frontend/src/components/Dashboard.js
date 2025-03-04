import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";

function Dashboard() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
   // const [userId, setUserId] = useState(null); 
    const token = localStorage.getItem("token");
    const [editMode, setEditMode] = useState(null);
    const [editData, setEditData] = useState({});

    const navigate = useNavigate();

    const fetchFeedbacks = useCallback(async () => {
        if (!token) return;
        try {
            const userResponse = await api.getCurrentUser(token);
            const fetchedUserId = userResponse.data.userId;

            const feedbackResponse = await api.getAllFeedbacks();
            console.log("full response:", feedbackResponse);
            if (!feedbackResponse || !feedbackResponse.feedbacks) {
                throw new Error("Invalid response format");
            }
            //console.log ("all fb:", feedbackResponse.feedbacks) 
            
            const userFeedbacks = feedbackResponse.feedbacks.filter(fb => fb.createdBy && (fb.createdBy._id === fetchedUserId || fb.createdBy === fetchedUserId));
            console.log("users fb:", userFeedbacks);
            setFeedbacks(userFeedbacks);
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
    }, [token, navigate, fetchFeedbacks]);

    const handleCreate = () => {
        navigate("/create-feedback", { state: { refreshDashboard: true } });
    };
    //edit feedback
    const handleEdit = (fb) => {
        setEditMode(fb._id);
        setEditData({title: fb.title, description: fb.description});
    }
    const handleInputChange = (e,field) => {
        setEditData(prev =>({...prev, [field]: e.target.value}));
    }
    //save edited
    const handleSaveEdit = async (id) => {
        try{
            setEditMode(null);
            await api.updateFeedback(id, editData);
            fetchFeedbacks();
        } catch(error){
            console.error("Error edit:", error);
        }
    }
    //update feedback
    const handleUpdateDate = async (id) => {
        try{
            const updateDate = { updatedAt: new Date().toLocaleString()};
            await api.updateFeedback(id, updateDate);

            setFeedbacks(prevFeedbacks => 
                prevFeedbacks.map(fb => fb._id ===id ? {...fb, updatedAt: updateDate.updatedAt} : fb)
            );
            //fetchFeedbacks();
        } catch(error){
            console.error("Error update:", error);
        }
    }

    return (
        <div className="container mt-4 flex flex-col min-h-screen">
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-danger" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
                    LOGOUT
                </button>
                <button className="btn btn-primary" onClick={() => navigate("/all-feedbacks")}>SEE ALL FEEDBACK</button>
            </div>
            <div className="text-center mb-3">
                <button className="btn btn-success" onClick={handleCreate}>CREATE FEEDBACK</button>
            </div>

            {loading ? (
                <p className="text-center mt-5">Loading..</p>
            ) : feedbacks.length > 0 ? (
                feedbacks.map((fb) => (
                    <div key={fb._id || fb.id} className="card p-3 mb-2">
                        {editMode === fb._id ? (
                            <div>
                                <input className="form-control mb-2" type="text"  value={editData.title} onChange={(e) => handleInputChange(e, "title")}/>
                                <textarea className="form-control mb-2" value={editData.description} onChange={(e) => handleInputChange(e, "description")}/>
                                <button className="btn btn-success w-25 btn-sm mb-2" onClick = {() => handleSaveEdit(fb._id)}>SAVE</button>
                            </div>
                        ): (
                            <div>
                                <h3>{fb.title}</h3>
                                <p>{fb.description}</p>
                                <div className="d-flex justify-content-between">
                                    <small className="text-muted">Created at: {new Date(fb.createdAt).toLocaleString()}</small>
                                    {fb.updatedAt && (
                                    <small className="text-muted ">Updated at: {new Date(fb.updatedAt).toLocaleString()} </small>
                                    )}
                                </div>   
                            </div>
                        )}
                        
                        <div className="d-flex justify-content-between gap-5"> 
                            {editMode=== fb._id ? (
                                <button className="btn btn-secondary w-25 btn-sm opacity-80" onClick={() => setEditMode(null)}>CANCEL</button>
                            ) : (
                                <button className="btn btn-success w-25 btn-sm opacity-80" onClick={() => handleEdit(fb)}>EDIT</button>
                            )}

                            <button className="btn btn-success w-25 btn-sm opacity-80" onClick ={() => handleUpdateDate(fb._id)}> UPDATE </button>

                            <button className="btn btn-danger w-25 btn-sm opacity-80" onClick={async () => {
                                await api.deleteFeedback(fb._id || fb.id);
                                fetchFeedbacks();
                            }}>DELETE</button>
                        </div>
                        
                    </div>
                ))
            ) : (
                <p className="text-center mt-5">No feedback yet</p>
            )}
        </div>
    );
}

export default Dashboard;
