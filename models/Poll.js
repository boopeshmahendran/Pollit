const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./User')

const pollSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  answers: {
    type: [{
      type: Schema.ObjectId,
      ref: 'Answer'
    }],
    required: true
  },
  created_by: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = mongoose.model('Poll', pollSchema)
