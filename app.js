const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', function(req, res){
  res.send('hello world')
})

app.listen(port, function() {
  console.log('Server started on port 3000')
})
