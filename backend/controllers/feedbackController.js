const Feedback = require('../models/Feedback');
const { StatusCodes } = require('http-status-codes')
const { BadRequest, NotFound, Unauthenticated } = require('../errors');

const createFeedback = async (req, res) => {
    const {title, description } = req.body;
    if (!title||!description) {
        throw new BadRequest ("Please type title and description");
    }
    if(!req.user||!req.user.userId){
      throw new Unauthenticated( "User unauthenticated")
    }

    const feedback = await Feedback.create({title, description, createdBy: req.user.userId})
    res.status(StatusCodes.CREATED).json( feedback );
  };

const getAllFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find().sort('createdAt').populate("createdBy", "username email");
  if(!feedbacks|| feedbacks.length ===0){
    return res.status(StatusCodes.OK).json({message: "No feedbacks found"})
  }
  res.status(StatusCodes.OK).json( feedbacks );
};

const getFeedback = async (req, res) => {
  const feedback = await Feedback.findById( req.params.id ).populate("createdBy", "username email");
  
  if (!feedback) {
    throw new NotFound(`No feedback with id ${req.params.id}`)
  }

  //console.log("DEBUG: check createdBy ->", feedback);
  res.status(StatusCodes.OK).json( feedback );
};

const updateFeedback = async (req, res) => {
  const {title, description} = req.body;
  const feedback = await Feedback.findById( req.params.id );
  if (!feedback) {
    throw new NotFound(`No feedback with id ${req.params.id }`)
  }

  if (!feedback.createdBy||feedback.createdBy.toString()!== req.user.userId) {
    throw new BadRequest('Sorry, you are not allowed to updat feedback');
  }
  
  feedback.title = title|| feedback.title;
  feedback.description = description|| feedback.description;

  await feedback.save();
  res.status(StatusCodes.OK).json( feedback );
};

const deleteFeedback = async (req, res) => {
    const feedback = await Feedback.findById( req.params.id );
    if (!feedback) {
        throw new NotFound(`No feedback with id ${req.params.id }`)
      }

    if (!feedback.createdBy||feedback.createdBy.toString()!== req.user.userId) {
        throw new BadRequest('Sorry, you are not allowed to updat feedback');
      }

    await feedback.deleteOne();
    res.status(StatusCodes.NO_CONTENT).send();
};

const upvoteFeedback = async (req, res) => {
    const feedback = await Feedback.findById( req.params.id );
    if (!feedback) {
        throw new NotFound(`No feedback with id ${req.params.id }`)
      }

    await feedback.upvote();
    res.status(StatusCodes.OK).json({message: "Upvoted", votes: feedback.votes});
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  upvoteFeedback,
}