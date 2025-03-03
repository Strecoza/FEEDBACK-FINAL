
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5500/api/v1";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" }
});

// Feedbacks
export const createFeedback = async (data) => {
    const token = localStorage.getItem("token");
    return api.post("/feedback", data, { headers: { Authorization: `Bearer ${token}` } });//try catch добавить и вывести в консоль
};

export const getAllFeedbacks = async ({ page = 1, limit = 6 } = {}) => {
    try {
        const timestamp = new Date().getTime();
        //console.log(`Fetching feedbacks: page= ${page}, limit =${limit}`)
        const response = await api.get(`/feedback?page=${page}&limit=${limit}&_=${timestamp}`);
        console.log("api raw response:", response);
        if (!Array.isArray(response.data)) {
            console.warn("Unexpected API response format", response);
            return { feedbacks: [], totalPages: 1 };
        }
        //console.log("api process response:", response.data)
        return {feedbacks: response.data, totalPages: 1};
    } catch (error) {
        console.error("API Error:", error);
        return { feedbacks: [], totalPages: 1}
    }
};

export const getFeedback = async (id) => {
    try{
        const response = await api.get(`/feedback/${id}`);
        return response.data;
    } catch (error) {
        console.log("Fetching error ", error);
        throw error;
    }
}
//api.get(`/feedback/${id}`);

export const updateFeedback = (id, data) => {
    const token = localStorage.getItem("token");
    return api.patch(`/feedback/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const upvoteFeedback = (id) => {
    const token = localStorage.getItem("token");
    return api.patch(`/feedback/${id}/upvote`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteFeedback = (id) => {
    const token = localStorage.getItem("token");
    return api.delete(`/feedback/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

// Comments
export const createComment = (data, token) => {
    return api.post("/comments", data, { headers: { Authorization: `Bearer ${token}` } });
};
export const getCommentsByFeedback = (feedbackId) => api.get(`/comments/feedback/${feedbackId}`);
export const deleteComment = (id, token) => {
    return api.delete(`/comments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

// Authorization
export const registerUser = (data) => axios.post(`${API_URL}/auth/register`, data);
export const loginUser = (data) => api.post(`${API_URL}/auth/login`, data);
export const getCurrentUser = (token) => api.get(`${API_URL}/auth/current`, { headers: { Authorization: `Bearer ${token}` } });

export default api;