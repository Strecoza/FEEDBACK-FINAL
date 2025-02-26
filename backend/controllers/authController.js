const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequest, Unauthenticated } = require('../errors')

const register = async (req, res) => {
  const {username, email, password } = req.body;
  if (!username||!email||!password){
    throw new BadRequest("Please fill out all fields");
  }
   
  const user = await User.create({ username, email, password })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { 
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt 
  }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new Unauthenticated('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new Unauthenticated('Invalid Credentials')
  }
  // compare password
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { 
    id: user._id,
    username: user.username,
    email: user.email,
    createdAt: user.cteatedAt 
  }, token })
}

module.exports = {
  register,
  login,
}