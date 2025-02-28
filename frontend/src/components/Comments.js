import React, { useState, useEffect } from "react";
import api from "../services/api";

function Comments({ feedbackId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    api.getCommentsByFeedback(feedbackId)
      .then((res) => setComments(res.data))
      .catch((err) => console.error("Error fetching comments:", err));
  }, [feedbackId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createComment({ feedback: feedbackId, text }, token);
      setText("");
      api.getCommentsByFeedback(feedbackId).then((res) => setComments(res.data));
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <div className="container mt-3">
      <h4>Comments</h4>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Write a comment" value={text} onChange={(e) => setText(e.target.value)} required />
        <button className="btn btn-secondary" type="submit">Post</button>
      </form>
      {comments.map((comment) => (
        <div key={comment._id} className="card p-2 my-2">
          <p>{comment.text}</p>
          <small>By: {comment.user?.username}</small>
        </div>
      ))}
    </div>
  );
}

export default Comments;