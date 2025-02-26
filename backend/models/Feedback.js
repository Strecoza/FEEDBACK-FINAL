const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        maxlength: 50,
    },
    description: {
        type: String,
        required: [true, 'Please provide description'],
        maxlength: 200,
    },
    votes:{
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

FeedbackSchema.methods.upvote = function () {
    this.votes += 1;
    return this.save();
};

FeedbackSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj._v;
    return obj;
};

module.exports = mongoose.model('Feedback', FeedbackSchema);