const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    feedback: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Feedback",
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text:{
        type: String,
        required: [true, "Please provide your comment"],
        maxlength: 300,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

CommentSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    return obj;
};

module.exports = mongoose.model('Comment', CommentSchema);