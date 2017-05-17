function isAuthenticated(req, res, next) {
  if (req.user) return next()
  else return res.json({ status: 'error', error: 'user not authenticated'})
}

module.exports = isAuthenticated
