const express = require('express')
const router = express.Router()
const Poll = require('../../models/Poll')
const Answer = require('../../models/Answer')
const Users_answered = require('../../models/Users_answered')
const isAuthenticated = require('../../utilities/isAuthenticated')

router.get('', function(req, res) {
  Poll.find()
  .select('-__v')
  .populate('created_by', '-_id username')
  .populate({
    path: 'answers',
    select: 'value votes created_by',
    populate: {
      path: 'created_by',
      select: '-_id username'
    }
  })
  .then(function(polls) {
    return res.json({ status: 'success', polls})
  })
  .catch(function(err) {
    console.log(err)
    return res.json({ status: 'error', error: 'server error' })
  })
})

router.post('/create', isAuthenticated, function(req, res) {
  const question = req.body.question
  const answers = req.body.answers

  if (!question || !answers || typeof question !== 'string' ||
  !Array.isArray(answers) || answers.length <= 0) {
    return res.json({ status: 'error', error: 'bad request'})
  }

  const newPoll = new Poll({
    question,
    created_by: req.user.id
  })

  let answersSaved = 0
  answers.forEach(function(answer) {
    const newAnswer = new Answer({
      value: answer,
      poll: newPoll.id,
      created_by: req.user.id
    })
    newAnswer.save().then(function(answer) {
      answersSaved++
      newPoll.answers.push(answer.id)
      if (answersSaved === answers.length) {
        return newPoll.save()
        .then(function(poll) {
          req.user.created_polls.push(poll.id)
          req.user.created_answers.push(...newPoll.answers)
          return req.user.save()
        })
        .then(function() {
          return res.json({ status: 'success'})
        })
      }
    }).catch(function(err) {
      console.log (err)
      return res.json({ status: 'error', 'error': 'server error'})
    })
  })
})

router.get('/:poll_id', function(req, res) {
  const pollId = req.params.poll_id
  Poll.findById(pollId)
  .select('-__v')
  .populate({
    path: 'answers',
    select: 'value votes created_by',
    populate: { path: 'created_by', select: '-_id username'}
  })
  .populate('created_by', '-_id username')
  .then(function(poll) {
    if (!poll) return res.json({ status: 'error', error: 'bad request'})
    const returnObj = {
      status: 'success',
      poll
    }
    if (!req.user) return res.json(returnObj)
    return Users_answered.findOne({user: req.user.id, poll: poll.id})
    .then(function(user_answered) {
      console.log(user_answered)
      if (user_answered) returnObj.answered_answer_id = user_answered.answer
      return res.json(returnObj)
    })
  })
  .catch(function(err) {
    console.log(err)
    return res.json({ status: 'error', error: 'server error'})
  })
})

router.delete('/:pollid', isAuthenticated, function(req, res) {
  const pollId = req.params.pollid
  Poll.findOneAndRemove({ _id: pollId, created_by: req.user.id })
  .then(function(poll) {
    if (!poll) return res.json({ status: 'error', error: 'bad request'})
    const index = req.user.created_polls.indexOf(poll.id)
    req.user.created_polls.splice(index, 1) // remove reference in user
    return Answer.remove({_id: {$in: poll.answers}}) // remove answers
  })
  .then(function() {
    return req.user.save()
  })
  .catch(function(err) {
    console.log(err)
    return res.json({ status: 'error', error: 'server error'})
  })
})

module.exports = router
