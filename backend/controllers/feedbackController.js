const Feedback = require('../models/Feedback');
const { StatusCodes } = require('http-status-codes')
const { BadRequest, NotFound } = require('../errors');

const createFeedback = async (req, res) => {
    const {title, description } = req.body;

    if (!title||!description) {
        throw new BadRequest ("Please type title and description");
    }

    const feedback = await Feedback.create({title, description, createdBy: req.user.userId})
    res.status(StatusCodes.CREATED).json( feedback );
  };

const getAllFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json( feedbacks )
};
const getFeedback = async (req, res) => {
  const feedback = await Feedback.findById( req.params.id ).sort('createdAt')
  
  if (!feedback) {
    throw new NotFound(`No feedback with id ${req.params.id}`)
  }
  res.status(StatusCodes.OK).json( feedback );
};

const updateFeedback = async (req, res) => {
  const {title, description} = req.body;
  const feedback = await Feedback.findById( req.params.id );
  if (!feedback) {
    throw new NotFound(`No feedback with id ${req.params.id }`)
  }

  if (feedback.createdBy.toString()!== req.user.userId) {
    throw new BadRequest('Sorry, you are not allowed to updat feedback');
  }

  await feedback.save();
  res.status(StatusCodes.OK).json( feedback );
};

const deleteFeedback = async (req, res) => {
    const feedback = await Feedback.findById( req.params.id );
    if (!feedback) {
        throw new NotFound(`No feedback with id ${req.params.id }`)
      }
    if (feedback.createdBy.toString()!== req.user.userId) {
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
    feedback.votes += 1;
    await feedback.save();
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