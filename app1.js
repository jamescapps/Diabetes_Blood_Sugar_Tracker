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
  res.sendFile(__dirname + '/views/createuser.html')
})

//Connect to database.
//mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.connect('mongodb://localhost/blood_sugar_tracker', { useUnifiedTopology: true, useNewUrlParser: true }) 

//Check that all the input of valid form and that passwords match and email is not currently registered.  Save the new user to the database.

app.post('/api/newuser', (req, res) => {
    var { firstname } = req.body
    var { lastname } = req.body
    var { email } = req.body
    var { password1 } = req.body
    var { password2 } = req.body

    var emailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    var nameCheck = /^[a-zA-Z ]+$/

    if (nameCheck.test(firstname)) {
        if (nameCheck.test(lastname)) {
            if (emailValidate.test(email)) {
                if ((password1 == password2)) {
                    modelUser.findOne({email: email}, (err, result) => {
                        if (err) {
                            res.send("Error reading database")
                        } else if (result) {
                            res.send("Email all ready in use")
                        } else {
                            var newUser = new modelUser(
                                {
                                    firstname: firstname,
                                    lastname: lastname,
                                    email: email,
                                    password: password2
                                }
                            )
                            newUser.save((err) => {
                                if (err) {
                                  return res.send("Error saving to database")
                                }
                                return res.json(newUser)
                              })
                        }
                    })
                } else {
                    res.send("Please make sure passwords match.")
                }
            }else {
                res.send("Please enter a valid email.")
            }
        }else {
            res.send("Please enter a valid last name.")
        }
    } else {
        res.send("Please enter a valid first name.")
    }
})




app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is working!")
})