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
          _id: req.params.thoughtId
        })
        .populate('reactions')
        .select('-__v')
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
      Thought.findByIdAndRemove({
          _id: req.params.thoughtId
        })
        .then((thoughtData) =>
          !thoughtData ?
          res.status(404).json({
            message: "No thought exists!"
          }) :
          User.findOneAndUpdate({
            thoughts: req.params.thoughtId
          }, {
            $pull: {
              thoughts: req.params.thoughtId
            }
          }, {
            new: true
          })
        )
        .then((thoughtData) =>
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
          $addToSet: {
            reactions: req.body
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
    try {
      Thought.findOneAndUpdate({
          _id: req.params.thoughtId
        }, {
          $pull: {
            reactions: {
              reactionId: req.params.reactionId
            }
          }
        }, {
          true: true,
          runValidators: true
        })
        .then((reactionData) =>
          !reactionData ?
          res.status(404).json({
            message: "No reaction exists!"
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
      res.json(reactionData)
    } catch (err) {
      res.status(400).json(err);
    }
  },
};


module.exports = thoughtController;
