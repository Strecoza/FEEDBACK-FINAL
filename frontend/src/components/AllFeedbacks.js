import React, { useState, useEffect } from "react";
import * as api from "../services/api";

const AllFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage =6;
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchFeedbacks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.getAllFeedbacks(page, itemsPerPage );
                setFeedbacks(response.data.feedbacks)
                    setTotalPages(response.data.totalPages)
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
                setError("Failed to load feedbacks. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, [page] );

    const handleUpvote = async (id) =>{
        try {
            await api.upvoteFeedback(id, token);
            setFeedbacks((prevFeedbacks) =>
                prevFeedbacks.map(fb =>fb._id === id ? { ...fb, votes: fb.votes + 1 } : fb)
            );
        } catch (error){
            console.error("Error upvoting feedback:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center" >All Feedbacks</h1>
            {loading ? (
                <p className="text-center">Loading..</p>
            ) : error ? (
                <p className="text-danger text-center">{error}</p>
            ) : feedbacks.length > 0 ? (
                <div>
                    {feedbacks.map((fb) => (
                        <div key={fb._id || fb.id} className="card p-3 mb-2">
                            <h3>{fb.title}</h3>
                            <p>{fb.description}</p>
                            <button className="btn btn-outline-primary" onClick = {() => handleUpvote(fb._id || fb.id)}> Upvote ({fb.votes})</button>
                        </div>
                    ))}
                    <div className="d-flex justify-content-between mt-3">
                        <button className="btn btn-outline-primary" disabled= {page === 1} onClick={() => setPage(page - 1)}> Previous</button>
                        <span>  Page {page} of {totalPages}</span>
                        <button className="btn btn-outline-primary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                    </div>
                </div>
            ) : (
                <p className="text-center">No feedbacks found.</p>
            )}
        </div>
    );
};

export default AllFeedbacks;