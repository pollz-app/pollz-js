const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors({ origin: '*'}));
app.use(bodyParser.json());

const polls = {};

app.post('/init', (req, res) => {
  const { appId, appSecret } = req.body;

  if (!appId || !appSecret) {
    return res.status(400).json({ error: 'Invalid app credentials' });
  }

  const clientId = uuidv4();
    const token = uuidv4();

  res.json({ token, clientId });
});

app.post('/create', (req, res) => {
  const { projectId, ...pollInput } = req.body;
  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is missing' });
  }

  const pollId = uuidv4();
  const poll = {
    id: pollId,
    title: pollInput.title,
    options: pollInput.options.map((opt) => ({
        id: uuidv4(),
        title: opt,
        voters: []
    })),
    createdAt: new Date(),
    projectId
};
  polls[pollId] = poll;

  res.json(poll);
});

app.get('/polls/:id', (req, res) => {
  const { id } = req.params;
  const poll = polls[id];

  if (!poll) {
    return res.status(404).json({ error: 'Poll not found' });
  }

  res.json(poll);
});

app.get('/polls', (req, res) => {
  const allPolls = Object.values(polls);
  res.json(allPolls);
});

app.post('/polls/:id/vote', (req, res) => {
  const { id } = req.params;
  const { optionId, voterId } = req.body;

  const poll = polls[id];
  if (!poll) {
    return res.status(404).json({ error: 'Poll not found' });
  }

  const option = poll.options.find((opt) => opt.id === optionId);
  if (!option) {
    return res.status(404).json({ error: 'Option not found' });
  }

  option.voters.push(voterId);

  res.json(poll);

  // Emit updated poll to clients
  io.emit(id, poll);
});

const server = app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// Socket.io setup
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }    
});
io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});