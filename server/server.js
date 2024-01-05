const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5174",  // Specify the origin of your React application
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./config/mongoose.config");

// Import the Poll controller
const pollController = require("./controllers/poll.controller");

// Define routes
app.post('/api/poll', pollController.createNewPoll);
app.get('/api/poll', pollController.getAllPolls);
app.get('/api/poll/:id', pollController.getOnePoll);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('voteUpdate', (updatedVoteCounts) => {
        console.log('Received voteUpdate:', updatedVoteCounts);
        io.emit('voteUpdate', updatedVoteCounts);
    });
});

server.listen(8007, () => {
    console.log("Listening at Port 8007");
});