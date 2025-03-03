import React, { useState } from "react";
import * as api from "../services/api";
import { useLocation } from "react-router-dom";

function FeedbackForm({ onSubmit, initialData = {} }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const token = localStorage.getItem("token");
  const [votes, setVotes] = useState(initialData.votes || 0)

  const location = useLocation();
  const isAllFeedbacksPage = location.pathname === "/all-feedbacks"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData._id) {
        await api.updateFeedback(initialData._id, { title, description }, token);
      } else {
        await api.createFeedback({ title, description }, token);
      }
      onSubmit(); 
    } catch (error) {
      console.error(" Submitting error:", error);
    }
  };

  const handleUpvote = async ()=> {
    try{
        await api.upvoteFeedback(initialData._id);
        setVotes(votes+1);
        onSubmit()
    } catch(error){
        console.error(" Upvoting error:", error);
    }
  }

  return (
    <div>
      <h2>{initialData._id ? "Edit Feedback" : "Create Feedback"}</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea className="form-control mb-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">{initialData._id?"Update" : "Submit"}</button>
        
      </form>
      {isAllFeedbacksPage&& initialData._id&& (
        <button className= "btn btn-outline-primary mt-3" onClick = {handleUpvote}>Upvote ({votes})</button>
      )}
    </div>
  );
}

export default FeedbackForm;