const moment = require("moment");
const {
  Schema,
  model
} = require('mongoose');


const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Schema.Types.ObjectId(),
    primary: true
  },
  reactionBody: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    get: (time) => moment(time).format('MMMM Do YYYY, h:mm:ss a'),
  }
}, {
  toJSON: {
    virtuals: true
  },
  id: false
});


const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    get: (time) => moment(time).format('MMMM Do YYYY, h:mm:ss a'),
  },
  username: {
    type: String,
    required: true
  },
  reactions: [reactionSchema]
}, {
  toJSON: {
    virtuals: true
  },
  id: false
});


// Create a virtual property called `reactionCount`
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});


// Initialize our Thought model
const Thought = model('Thought', thoughtSchema);


module.exports = Thought;
