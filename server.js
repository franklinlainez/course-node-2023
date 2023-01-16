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

app.get('/friends', (req, res) => {
  res.json(friends);
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
