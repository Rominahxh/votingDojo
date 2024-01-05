const mongoose = require('mongoose');

const PollsSchema = new mongoose.Schema({
question: {
    type: String,
    required: [true, 'Question is required'],
    minlength: [10, 'Question must be at least 10 characters or longer'],
},
options: [
    {
    type: String,
    required: [true, 'Option text is required'],
    minlength: [1, 'Option text must not be empty'],
    voteCounts: { type: Number, default: 0 },
    },
    {
    type: String,
    required: [true, 'Option text is required'],
    minlength: [1, 'Option text must not be empty'],
    voteCounts: { type: Number, default: 0 },
    },
    {
    type: String,
    minlength: [1, 'Option text must not be empty'],
    voteCounts: { type: Number, default: 0 },
    },
    {
    type: String,
    minlength: [1, 'Option text must not be empty'],
    voteCounts: { type: Number, default: 0 },
    },
],
    createdAt: {
    type: Date,
    default: Date.now,
},
});

module.exports = mongoose.model('Poll', PollsSchema);

