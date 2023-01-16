const express = require('express');

const app = express();

const PORT = 3000;

const friends = [
  {
    id: 0,
    name: 'Isaac Netero',
  },
  {
    id: 1,
    name: 'Meruem',
  },
];

app.use((req, res, next) => {
  const start = Date.now();
  next();

  // actions go here...
  const delta = Date.now() - start;
  console.log(`${req.method} ${req.url} ${delta}ms`);
});

app.use(express.json());

app.get('/friends', (req, res) => {
  res.json(friends);
});

app.post('/friends', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      error: 'Missing friend name',
    });
  }

  const newFriend = {
    name: req.body.name,
    id: friends.length,
  };
  friends.push(newFriend);
  res.json(newFriend);
});

app.get('/friends/:friendId', (req, res) => {
  const { friendId } = req.params;
  const friend = friends[+friendId];
  if (friend) {
    res.json(friend);
  } else {
    res.status(404).json({
      error: 'friend does not exist',
    });
  }
});

app.get('/messages', (req, res) => {
  res.send('<ul><li>Hello Moto</li></ul>');
});

app.post('/messages', (req, res) => {
  console.log('Updating messages...');
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
