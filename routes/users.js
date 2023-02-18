const bcrypt = require('bcrypt')
const express = require('express')
const { User, validateUser, validateLogin } = require("../models/user")
const router  = express.Router()

// getting single user
router.get('/:id', async(req, res) => {
  let user = await User.findById(req.params.id)
  if(!user) return res.status(400).send("user not found...")

   res.header("Access-Control-Allow-Origin", "*").send(user)
})

// getting all users
router.get('/', async(req, res) => {
  const users = await User.find()

  res.header("Access-Control-Allow-Origin", "*").send(users)
})

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
  res.header("Access-Control-Allow-Origin", "*").send(user)
})




//create a new user
router.post('/signup', async (req, res) => {
  const {username, email, password, referral} = req.body
  const { error } = validateUser(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ $and: [{email}, {username}] })
  if(user) return res.status(400).send("User already exists..")

  let referredBy = await User.findOne({ username: referral })

  user = new User({ username, email, password })

  try{
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user = await user.save()
    const token = await user.genAuthToken()
    referredBy.referralBonus ++
    referredBy = await referredBy.save()
    res.header("Access-Control-Allow-Origin", "*").send(user)
  }
  catch(e){
    for(i in e.errors){
      res.status(500).send(e.errors[i].message)
    }
  }
})


module.exports = router