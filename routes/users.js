const bcrypt = require('bcrypt')
const express = require('express')
const { User, validateUser, validateLogin } = require("../models/user")
const router  = express.Router()

// login user
router.post('/login', async(req, res) => {
  const { email, password } = req.body
  const { error } = validateLogin(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email })
  if(!user) return res.status(400).send("Invalid email or password...")

  const validatePassword = await bcrypt.compare(password, user.password)
  if(!validatePassword) return res.status(400).send("Invalid email or password...")

  const token = await user.genAuthToken()
  res.send(token)
})




//create a new user
router.post('/signup', async (req, res) => {
  const {username, email, password} = req.body
  const { error } = validateUser(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email })
  if(user) return res.status(400).send("User already exists..")
  
  user = new User({ username, email, password })

  try{
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user = await user.save()
    const token = await user.genAuthToken()
    res.header("x-auth-token", token).send(user)
  }
  catch(e){
    for(i in e.errors){
      res.status(500).send(e.errors[i].message)
    }
  }
})


module.exports = router