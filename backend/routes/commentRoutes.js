const express = require("express");
const {createComment, getCommentsByFeedback} = require ("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createComment);
router.get("/:feedbackId", getCommentsByFeedback);

module.exports = router;