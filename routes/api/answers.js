const express = require('express')
const router = express.Router()
const Poll = require('../../models/Poll')
const Answer = require('../../models/Answer')
const isAuthenticated = require('../../utilities/isAuthenticated')
const Users_answered = require('../../models/Users_answered')

router.post('/create', isAuthenticated, function(req, res) {
  const pollId = req.body.poll_id
  const answer = req.body.answer

  if (!pollId || !answer) return res.json({ status: 'error', error: 'bad request'})
  let newAnswer;

  Poll.findById(pollId)
  .then(function(poll) {
    if (!poll) return res.json({ status: 'error', error: 'poll_id does not exist'})
    newAnswer = new Answer({
      value: answer,
      poll: poll.id,
      created_by: req.user.id
    })
    poll.answers.push(newAnswer.id)
    req.user.created_answers.push(newAnswer.id)
    return poll.save()
    .then(function() {
      return req.user.save()
    })
    .then(function() {
      return newAnswer.save()
    })
    .then(function() {
      return res.json({ status: 'success' })
    })
  })
  .catch(function(err) {
    console.log(err)
    return res.json({ status: 'error', error: 'server error'})
  })
})

router.post('/:answer_id', isAuthenticated, function(req, res) {
  const answerId = req.params.answer_id
  Answer.findByIdAndUpdate(answerId, { $inc: {votes: 1} })
  .then(function(answer) {
    if (!answer) return res.json({ status: 'error', error: 'bad request'})
    return Users_answered.findOneAndUpdate(
      {user: req.user.id, poll: answer.poll}, {answer: answer.id}, {upsert: true}
    )
    .then(function(user_answered) {
      console.log(user_answered)
      if (user_answered) {
        return Answer.findByIdAndUpdate(user_answered.answer, { $inc: {votes: -1} })
        .then(function(answer) {
          return res.json({ status: 'success'})
        })
      } else {
        console.log(answer.poll)
        return Poll.findByIdAndUpdate(answer.poll, { $inc: {votes: 1} })
        .then(function() {
          return res.json({ status: 'success'})
        })
      }
    })
  })
  .catch(function(err) {
    console.log(err)
    return res.json({ status: 'error', error: 'server error'})
  })
})

router.delete('/:answer_id', isAuthenticated, function(req, res) {
  const answerId = req.params.answer_id
  Answer.findOneAndRemove({ _id: answerId, created_by: req.user.id })
  .then(function(answer) {
    if (!answer) return res.json({ status: 'error', error: 'bad request'})
    const index = req.user.created_answers.indexOf(answer.id)
    req.user.created_answers.splice(index, 1)
    return Poll.findByIdAndUpdate(answer.poll, { $pull: {answers: answer.id }})
  })
  .then(function(poll) {
    return poll.save()
  })
  .then(function() {
    return req.user.save()
  })
  .then(function() {
    return res.json({ status: 'success'})
  })
  .catch(function(err) {
    console.log(err)
    return res.json({ status: 'error', error: 'server error'})
  })
})

module.exports = router
