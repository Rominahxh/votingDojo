const pollController = require("../controllers/poll.controller");

module.exports = (app) => {
  app.post("/api/polls", pollController.createNewPoll); // Changed from "/api/poll" to "/api/polls" for consistency
  app.get("/api/polls", pollController.getAllPolls);
  app.get("/api/polls/:id", pollController.getOnePoll); // Changed from "/api/poll/:id" to "/api/polls/:id" for consistency
  app.post("/api/polls/:id/vote", pollController.submitVote); // Added a new route for submitting votes
};
