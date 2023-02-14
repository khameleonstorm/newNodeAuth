const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 225
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1000
  },
  deposit: {
    type: Number,
    default: 0,
    minLength: 0,
  },
  withdraw: {
    type: Number,
    default: 0,
    minLength: 0,
  },
  referralBonus: {
    type: Number,
    default: 0,
    minLength: 0,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});


userSchema.methods.genAuthToken = function(){
  return jwt.sign({_id: this._id, email: this.email, isAdmin: this.isAdmin}, process.env.JWT_PRIVATE_KEY)
}

const User = mongoose.model("User", userSchema);


const  validateUser = (user) => {
  const schema = {
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(5).max(225).email().required(),
    password: Joi.string().min(5).max(20).required(),
  }

  return Joi.validate(user, schema)
}


const  validateLogin = (user) => {
  const schema = {
    email: Joi.string().min(5).max(225).email().required(),
    password: Joi.string().min(5).max(20).required(),
  }

  return Joi.validate(user, schema)
}


exports.validateUser = validateUser;
exports.validateLogin = validateLogin;
exports.User = User;
exports.userSchema = userSchema;