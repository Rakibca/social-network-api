const {
  Schema,
  model
} = require('mongoose');


const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // https://regexr.com
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'It has to be a valid email address']
  },
  thoughts: [{
    type: Schema.Types.ObjectId,
    ref: 'Thought'
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
}, {
  toJSON: {
    virtuals: true,
  },
  id: false,
});


// Create a virtual property called `friendCount`
userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});


// Initialize our User model
const User = model('User', userSchema);

module.exports = User;
