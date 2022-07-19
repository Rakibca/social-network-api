const {
  Thought,
  User
} = require("../models");


const thoughtController = {
  getThoughts(req, res) {
    Thought.find()
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => {
        res.status(500).json(err);
      });
  },


  getSingleThought(req, res) {
    Thought.findOne({
        _id: req.params.id
      })
      .then((thoughtData) => {
        !thoughtData
          ?
          res.status(404).json({
            message: "No thought exists!",
          }) :
          res.json(thoughtData);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },


  createThought(req, res) {
    Thought.create(req.body)
      .then((thoughtData) => {
        return User.findByIdAndUpdate(
          req.body.userId, {
            $push: {
              thoughts: thoughtData._id
            }
          }, {
            new: true
          }
        );
      })
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => {
        res.status(500).json(err);
      });
  },


  updateThought({
    params,
    body
  }, res) {
    Thought.findOneAndUpdate({
        _id: params.id
      }, body, {
        new: true,
        runValidators: true,
      })
      .then((updatedThought) => {
        if (!updatedThought) {
          return res.status(404).json({
            message: "No thought exists!"
          });
        } else {
          res.json(updatedThought);
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },


  deleteThought(req, res) {
    Thought.findOneAndDelete({
        _id: req.params.id
      })
      .then((thoughtData) => {
        !thoughtData
          ?
          res.status(404).json({
            message: "No thought exists!"
          }) :
          res.status(200).json({
            message: "Thought deleted!.",
          });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },


  //////////////////////////////////////////////////////////////////////


  createReaction({
    params,
    body
  }, res) {
    Thought.findOneAndUpdate({
        _id: params.thoughtId
      }, {
        $push: {
          reactions: body
        }
      }, {
        new: true,
        runValidators: true
      })
      .then((thoughtData) => {
        !thoughtData
          ?
          res.status(404).json({
            message: "No thought exists!"
          }) :
          res.json({
            message: "Reaction added!",
            thoughtData,
          });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },


  deleteReaction(req, res) {
    Thought.findOneAndUpdate({
        _id: req.params.thoughtId
      }, {
        $pull: {
          reactions: {
            reactionId: req.params.reactionId
          }
        }
      })
      .then((thoughtData) => {
        !thoughtData
          ?
          res.status(404).json({
            message: "No reaction exists!"
          }) :
          res.status(200).json({
            message: "Reaction deleted!",
          });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};


module.exports = thoughtController;
