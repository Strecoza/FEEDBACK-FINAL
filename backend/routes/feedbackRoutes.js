const express = require("express");
const {
    getAllFeedbacks,
    getFeedback,
    createFeedback,
    updateFeedback,
    upvoteFeedback,
    deleteFeedback,
} = require ("../controllers/feedbackController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//create feedback
router.post("/", authMiddleware, createFeedback);

//get all feedbacks
router.get("/", getAllFeedbacks);

//get, update and delete feedback
router.route("/:id")
    .get(getFeedback)
    .patch(authMiddleware, updateFeedback)
    .delete(authMiddleware, deleteFeedback)

//upvote by authorized user
router.patch("/:id/upvote", authMiddleware, upvoteFeedback);

module.exports = router;
