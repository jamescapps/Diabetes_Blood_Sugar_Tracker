//Setup
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const modelUser = require('./models/modelUser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

//Use index.html file
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/loggedin.html')
})

//Connect to database.
//mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.connect('mongodb://localhost/blood_sugar_tracker', { useUnifiedTopology: true, useNewUrlParser: true }) 



app.post('/api/postreading', (req, res) => {
  var { email } = req.body
  var { newreading } = req.body

  //Make sure it is a 2 or 3 digit number
  var numberTest = /^\d{2,3}$/

  //Test number and make sure it is not at a dangerous level.  Check to email, save reading, with the current date.
  if (numberTest.test(newreading)) {
    if (newreading < 55) {
      res.send("Your level is very low. Seek medical treatment immediately.")
    } else if (newreading > 400) {
      res.send("Your level is very high. Seek medical treatment immediately.")
    } else {
      modelUser.findOne({email: email}, (err, result) => {
        if (err) {
          res.send("Error reading database")
      } else if (!result) {
          res.send("Email does not exist")
      } else {
        var currentLevel = (
          {
            level: newreading,
            date: Date.now()
          }
        )
        result.sugarLevel.push(currentLevel)
        result.save((err) => {
          if (err) {
            res.send("Error saving to database")
          } 
        })
        res.send(result)
      }
      })
    }
  } else {
   res.send("Your level should be a 2 or 3 digit number.")
  }
    console.log(email, newreading)
})




app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is working!")
})