const Poll = require('../models/polls.model');

const createNewPoll = async (req, res) => {
  const { question, options } = req.body;

  try {
    // Check if a poll with the same question already exists
    const existingPoll = await Poll.findOne({ question });

    if (existingPoll) {
      return res.status(400).json({ error: 'Poll with the same question already exists.' });
    }

    // If no existing poll, create the new poll
    const newPoll = await Poll.create({ question, options });
    res.json({ newPoll });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create a new poll.' });
  }
};

const getAllPolls = async (req, res) => {
  try {
    const allPolls = await Poll.find();
    res.json(allPolls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch polls.' });
  }
};

const getOnePoll = async (req, res) => {
  console.log("Fetching poll with ID:", req.params.id);

  try {
    const onePoll = await Poll.findById(req.params.id).populate('options');

    if (!onePoll) {
      return res.status(404).json({ error: 'Poll not found.' });
    }

    res.json(onePoll);
  } catch (err) {
    console.error(`Error retrieving poll: ${err.message}`);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const submitVote = async (req, res) => {
  const { id } = req.params;
  const { option } = req.body;

  try {
    // Find the poll by ID
    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found.' });
    }

    // Find the option within the poll's options array
    const selectedOption = poll.options.find((pollOption, index) => index === option);

    if (!selectedOption) {
      return res.status(400).json({ error: 'Invalid option selected.' });
    }

    // Increment the votes for the selected option
    selectedOption.votes += 1;

    // Save the updated poll with the incremented votes
    const updatedPoll = await poll.save();

    // Broadcast the updated vote counts to connected clients using Socket.io
    io.emit("voteUpdate", updatedPoll.options.map((option) => option.votes));

    res.json(updatedPoll);
  } catch (error) {
    console.error(`Error submitting vote: ${error.message}`);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


module.exports = {
  createNewPoll,
  getAllPolls,
  getOnePoll,
  submitVote,
};
