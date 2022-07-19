const {
  Thought,
  User
} = require("../models");


const userController = {
  getUsers(req, res) {
    User.find()
      .populate("thoughts")
      .populate("friends")
      .select("-__v")
      .sort({
        _id: -1
      })
      .then((userData) => res.json(userData))
      .catch((err) => {
        res.status(500).json(err);
      });
  },


  getSingleUser(req, res) {
    User.findOne({
        _id: req.params.id
      })
      .then((user) => res.json(user))
      .catch((err) => {
        console.log("No user exists!", err);
        res.status(500).json(err);
      });
  },


  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        res.status(500).json(err);
      });
  },


  updateUser(req, res) {
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
      .catch((err) => {
        res.status(500).json(err);
      });
  },




  deleteUser(req, res) {
    User.findOneAndDelete({
        _id: req.params.id
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: "No user exists!"
          });
        }
        Thought.deleteMany({
            username: user.username
          })
          .then((user) => {
            res.status(200).json({
              message: "User deleted!",
            });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },


  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////


  addFriend(req, res) {
    User.findByIdAndUpdate(
        req.params.id, {
          $push: {
            friends: req.params.friendId
          }
        }, {
          new: true
        }
      )
      .then((dbFriendData) => {
        if (!dbFriendData) {
          res.status(404).json({
            message: "No user exists!"
          });
        } else {
          res.status(200).json({
            message: "Friends updated!",
            user: dbFriendData,
          });
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },


  deleteFriend(req, res) {
    User.findByIdAndUpdate({
        _id: req.params.id
      }, {
        $pull: {
          friends: req.params.friendId
        }
      }, {
        new: true
      })
      .then((dbFriendData) => {
        if (!dbFriendData) {
          res.status(404).json({
            message: "No user exists!"
          });
        } else {
          res.status(200).json({
            message: "Friend deleted!",
            user: dbFriendData,
          });
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};


module.exports = userController;
