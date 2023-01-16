const model = require('../models/friends.model');

function getFriend(req, res) {
  const { friendId } = req.params;
  const friend = model[+friendId];
  if (friend) {
    res.json(friend);
  } else {
    res.status(404).json({
      error: 'friend does not exist',
    });
  }
}

function postFriend(req, res) {
  if (!req.body.name) {
    return res.status(400).json({
      error: 'Missing friend name',
    });
  }

  const newFriend = {
    name: req.body.name,
    id: model.length,
  };
  model.push(newFriend);
  res.json(newFriend);
}

function getFriends(req, res) {
  res.json(model);
}

module.exports = {
  getFriend,
  postFriend,
  getFriends,
};
