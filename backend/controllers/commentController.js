const Comment = require("../models/Comment");
const Feedback = require("../models/Feedback");
const {StatusCodes} = require("http-status-codes");
const {BadRequest, NotFound} = require("../errors");

const createComment = async (req, res) => {
    const {feedbackId, text} = req.body;
    if (!feedbackId||!text) {
            throw new BadRequest ("Please type feedback ID and comment text");
        }
    
    const feedbackExists = await Feedback.findById(feedbackId);
    if (!feedbackExists) {
        throw new NotFound (`Feedback with ID: ${feedbackId} not found`)
    }
    const comment = await Comment.create({feedback: feedbackId, user: req.user.userId})
    res.status(StatusCodes.CREATED).json(comment);
    };
    
const getCommentsByFeedback = async (req, res) => {
      const {feedbackId} = req.params;
      const comments = await Comment.find({feedback: feedbackId}).populate("user", "username");
      res.status(StatusCodes.OK).json(comments);
    };
    
const deleteComment = async (req, res) => {
    const comment = await Comment.findById( req.params.id );
    if (!comment) {
        throw new NotFound(`No comment with id ${req.params.id }`)
        }
    if (comment.user.toString()!== req.user.userId) {
        throw new BadRequest('Sorry, you are not allowed to delete this comment');
        }
    await comment.deleteOne();
    res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = {
    createComment,
    getCommentsByFeedback,
    deleteComment,
}