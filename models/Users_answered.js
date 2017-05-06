const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User')
const Poll = require('./Poll')
const Answer = require('./Answer')

const usersAnsweredSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  poll: {
    type: Schema.ObjectId,
    ref: 'Poll'
  },
  answer: {
    type: Schema.ObjectId,
    ref: 'Answer'
  }
})

usersAnsweredSchema.index({user: 1, poll: 1})

module.exports = mongoose.model('Users_answered', usersAnsweredSchema)
