const {
  Thought,
  User
} = require("../models");


const userController = {

  getUsers(req, res) {
    try {
      User.find()
        .populate("friends")
        .populate("thoughts")
        .select("-__v")
        .sort({
          _id: -1
        })
        .then((userData) => res.json(userData))
    } catch (err) {
      res.status(400).json(err);
    }
  },


  getSingleUser(req, res) {
    try {
      User.findOne({
          _id: req.params.userId
        })
        .then((user) =>
          !user ?
          res.status(404).json({
            message: 'No user exists!'
          }) :
          res.json(user)
        )
    } catch (err) {
      res.status(400).json(err);
    }
  },


  createUser(req, res) {
    try {
      User.create(req.body)
        .then((user) => res.json(user))
    } catch (err) {
      res.status(400).json(err);
    }
  },


  updateUser(req, res) {
    try {
      User.findOne({
          _id: req.params.userId
        })
        .then((user) =>
          Thought.updateMany({
            username: user.username
          }, {
            $set: {
              username: req.body.username
            }
          }, )
        )
        .then(() =>
          User.findOneAndUpdate({
            _id: req.params.userId
          }, {
            $set: req.body
          }, {
            runValidators: true,
            new: true
          })
        )
        .then((user) =>
          !user ?
          res.status(404).json({
            message: 'No user exists!'
          }) :
          res.json(user)
        )
    } catch (err) {
      res.status(400).json(err);
    }
  },


  deleteUser(req, res) {
    try {
      User.findOne({
          _id: req.params.userId
        })
        .then((user) =>
          Thought.deleteMany({
            username: user.username
          })
        )
        .then(() =>
          User.findOneAndDelete({
            _id: req.params.userId
          })
        )
        .then((user) =>
          res.json(user)
        )
    } catch (err) {
      res.status(400).json(err);
    }
  },


  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////


  addFriend(req, res) {
    try {
      User.findOneAndUpdate({
          _id: req.params.userId
        }, {
          $push: {
            friends: req.params.friendId
          }
        }, {
          runValidators: true,
          new: true
        }, )
        .then((friendData) =>
          !friendData ?
          res.status(404).json({
            message: 'No user exists!'
          }) :
          res.json(friendData)
        )
    } catch (err) {
      res.status(400).json(err);
    }
  },


  deleteFriend(req, res) {
    try {
      User.findOneAndDelete({
          _id: req.params.friendId
        })
        .then((friend) =>
          !friend ?
          res.status(404).json({
            message: 'You have no friend relationship!'
          }) :
          User.findOneAndUpdate({
            friends: req.params.friendId
          }, {
            $pull: {
              friend: req.params.friendId
            }
          }, {
            new: true
          })
        )
        .then((user) =>
          res.json(user)
        )
    } catch (err) {
      res.status(400).json(err);
    }
  }
};


module.exports = userController;
