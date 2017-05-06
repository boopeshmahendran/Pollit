const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User')
const Poll = require('./Poll')

const answerSchema = new Schema({
  value: {
    type: String,
    required: true
  },
  poll: {
    type: Schema.ObjectId,
    ref: 'Poll',
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  created_by: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Answer', answerSchema)
