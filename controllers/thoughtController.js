const {
  Thought,
  User
} = require("../models");


const thoughtController = {
  getThoughts(req, res) {
    try {
      Thought.find()
        .then((thoughtData) => res.json(thoughtData))
    } catch (err) {
      res.status(400).json(err);
    }
  },


  getSingleThought(req, res) {
    try {
      Thought.findOne({
          _id: req.params.id
        })
        .then((thoughtData) => {
          !thoughtData
            ?
            res.status(404).json({
              message: "No thought exists!"
            }) :
            res.json(thoughtData);
        })
    } catch (err) {
      res.status(400).json(err);
    }
  },


  createThought(req, res) {
    try {
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
    } catch (err) {
      res.status(400).json(err);
    }
  },


  updateThought(req, res) {
    try {
      Thought.findOneAndUpdate({
          _id: req.params.thoughtId
        }, {
          $set: req.body
        }, {
          runValidators: true,
          new: true
        })
        .then((thoughtData) =>
          !thoughtData ?
          res.status(404).json({
            message: "No thought exists!"
          }) :
          res.json(thoughtData)
        )
    } catch (err) {
      res.status(400).json(err);
    }
  },


  deleteThought(req, res) {
    try {
      Thought.findOneAndDelete({
          _id: req.params.id
        })
        .then((thoughtData) =>
          !thoughtData ?
          res.status(404).json({
            message: "No thought exists!"
          }) :
          res.json(thoughtData)
        )
    } catch (err) {
      res.status(400).json(err);
    }
  },


  /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////


  createReaction(req, res) {
    try {
      Thought.findOneAndUpdate({
          _id: req.params.thoughtId
        }, {
          $push: {
            reactions: req.params.reactionId
          }
        }, {
          runValidators: true,
          new: true
        }, )
        .then((thoughtData) =>
          !thoughtData ?
          res.status(404).json({
            message: "No thought exists!"
          }) :
          res.json(thoughtData)
        )
    } catch (err) {
      res.status(400).json(err);
    }
  },


  deleteReaction(req, res) {
    Thought.findOneAndDelete({
        _id: req.params.reactionId
      })
      .then((reaction) =>
        !reaction ?
        res.status(404).json({
          message: 'No reaction with that ID'
        }) :
        Thought.findOneAndUpdate({
          reactions: req.params.reactionId
        }, {
          $pull: {
            reaction: req.params.reactionId
          }
        }, {
          new: true
        })
      )
      .then(() => res.json({
        message: 'Reaction deleted!'
      }))
      .catch((err) => res.status(500).json(err));
  },
};


module.exports = thoughtController;
