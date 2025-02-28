const Comment = require("../models/Comment");
const Feedback = require("../models/Feedback");
const {StatusCodes} = require("http-status-codes");
const {BadRequest, NotFound} = require("../errors");
const {ObjectId} = require("mongoose").Types;

const createComment = async (req, res) => {
    const {feedback, text} = req.body;
    if (!feedback||!text) {
            throw new BadRequest ("Please type feedback ID and comment text");
        }
    
    const feedbackExists = await Feedback.findById(feedback);
    if (!feedbackExists) {
        throw new NotFound (`Feedback with ID: ${feedback} not found`)
    }
    const comment = await Comment.create({feedback, user: req.user.userId, text})
    res.status(StatusCodes.CREATED).json(comment);
    };
    
const getCommentsByFeedback = async (req, res) => {
      const {feedbackId} = req.params;
      const comment = await Comment.find({feedback: feedbackId}).populate("user", "username");
      res.status(StatusCodes.OK).json(comment);
    };
    
const deleteComment = async (req, res) => {
    const comment = await Comment.findById( req.params.id );
    if (!comment) {
        throw new NotFound(`No comment with id ${req.params.id }`)
        }
    if (!comment.user||comment.user.toString()!== req.user.userId) {
        return res.status(403).json({message:'Sorry, you are not allowed to delete this comment'});
        }
    await comment.deleteOne();
    res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = {
    createComment,
    getCommentsByFeedback,
    deleteComment,
}