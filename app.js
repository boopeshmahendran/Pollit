const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const passport = require('passport')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')

mongoose.connect('mongodb://localhost:27017/pollit')

const app = express()

const apiRoutes = require('./routes/api')

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(cookieParser())
app.use(session({
  secret: 'abc',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use('/api', apiRoutes)

app.get('/', function(req, res){
  res.send('hello world')
})

app.listen(port, function() {
  console.log('Server started on port 3000')
})
