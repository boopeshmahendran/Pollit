const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

router.post('/register', function(req, res) {
  const name = req.body.name
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email

  // validation
  if (!username || !password || (email && !validator.isEmail(email))) {
    return res.json({ status: 'error', error: 'bad request' })
  }

  const newUser = new User({ name, username, password, email })

  // hash password and save
  bcrypt.genSalt(14)
  .then(function(salt) {
    return bcrypt.hash(newUser.password, salt)
  })
  .then(function(hash) {
    newUser.password = hash
    return newUser.save()
  })
  .then(function() {
    return res.json({ status: 'success' })
  })
  .catch(function(err) {
      if (err.name === 'MongoError' && err.code === 11000)
        return res.json({ status: 'error', error: 'username already exists'})
      else {
        console.log(err)
        return res.json({ status: 'error', error: 'server error'})
      }
  })
})

passport.use(new LocalStrategy(
  function(username, password, done) {
    if (!username || !password) return done(null, false, { message: 'bad request' });
    User.findOne({ username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'username does not exist' });
      }
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) return done(err)
        if (isMatch) return done(null, user)
        else return done(null, false, { message: 'password wrong' })
      })
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log(err)
      return res.json({ status: 'error', error: 'server error'})
    }
    if (!user) return res.json({ status: 'error', error: info.message})
    req.logIn(user, function(err) {
      if (err) {
        console.log(err)
        return res.json({ status: 'error', error: 'server error'})
      }
      return res.json({ status: 'success'})
    });
  })(req, res);
});

router.get('/logout', function(req, res) {
  req.logout()
  res.json({ status: 'success'})
})

router.get('/:username', function(req, res) {
  const username = req.params.username
  User.findOne({ username })
  .select('-_id name username email created_polls')
  .populate('created_polls', 'question votes')
  .then(function(user) {
    if (!user) return res.json({ status: 'error', error: 'bad request'})
    return res.json({ status: 'success', profile: user })
  }).catch(function(err) {
    console.log(err)
    return res.json({ status: 'error', error: 'server error'})
  })
})


module.exports = router
