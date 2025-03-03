import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";
import Pagination from "./Pagination";

const AllFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    //const [totalPages, setTotalPages] = useState(1);
    const feedbacksPerPage = 4; 
    const navigate = useNavigate();

    const fetchFeedbacks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.getAllFeedbacks({}); 
            console.log("AllFeedbacks - API Response:", response);

            if (!response || !Array.isArray(response.feedbacks)) {
                throw new Error("Invalid response format");
            }
            setFeedbacks(response.feedbacks); 
           // setTotalPages(response.totalPages || Math.ceil(response.feedbacks.length / feedbacksPerPage)); 
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            setError("Failed to load feedbacks. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);


    //feedbacks settings
    const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);
    const indexOfLastFeedback = page * feedbacksPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
    const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);

    
    const handleUpvote = async (id) =>{
        try {
            const response = await api.upvoteFeedback(id);
            setFeedbacks((prevFeedbacks) =>
                prevFeedbacks.map((feedback) =>
                  feedback._id === id ? { ...feedback, votes: response.data.votes } : feedback
                )
            );
        } catch (error){
            console.error("Error upvoting feedback:", error);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks]);

    return (
        <div className="container mt-4 flex flex-col min-h-screen">
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>DASHBOARD</button>
                <button className="btn btn-danger" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
                    LOGOUT
                </button>              
            </div>
            <h1 className="text-2xl font-bold mb-2 text-center" >All Feedbacks</h1>
            {loading && <p>Loading feedbacks...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {feedbacks.length === 0 && !loading && !error && <p>No feedbacks available.</p>}
            <div className="grid grid-cols-1 md:grid-cols-3  gap-1">
            {currentFeedbacks.map((feedback) => (
                <div key={feedback._id} className="p-2 border rounded shadow mb-2">
                    <h2 className="text-xl font-semibold">{feedback.title}</h2>
                    <p className="text-gray-700">{feedback.description}</p>
                    <div className="flex justify-between items-center mt-2">
                        <button onClick={() => handleUpvote(feedback._id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">Upvote ({feedback.votes})</button>
                    </div>
                </div>
                ))}
            </div>
            <Pagination page = {page} totalPages={totalPages} setPage = {setPage}/>
        </div>
    );
};

export default AllFeedbacks;