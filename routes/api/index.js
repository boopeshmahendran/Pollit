const express = require('express')
const router = express.Router()
const usersRoutes = require('./users')
const pollsRoutes = require('./polls')
const answersRoutes = require('./answers')

router.use('/users', usersRoutes)
router.use('/polls', pollsRoutes)
router.use('/answers', answersRoutes)

module.exports = router
