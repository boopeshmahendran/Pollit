const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Poll = require('./Poll')
const Answer = require('./Answer')

const userSchema = new Schema({
  name: String,
  username: {
    type: String,
    index: {
      unique: true
    },
    required: true
  },
  email: String,
  password: {
    type: String,
    required: true
  },
  created_polls: [{
    type: Schema.ObjectId,
    ref: 'Poll'
  }],
  created_answers: [{
    type: Schema.ObjectId,
    ref: 'Answer'
  }]
})

module.exports = mongoose.model('User', userSchema)
