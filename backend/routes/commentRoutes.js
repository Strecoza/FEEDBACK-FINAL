const express = require("express");
const {createComment, getCommentsByFeedback, deleteComment} = require ("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createComment);
router.get("/feedback/:feedbackId", getCommentsByFeedback);
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;