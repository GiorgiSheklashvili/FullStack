const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const body = request.body
  let user
  if(body.password){
    if(body.password.length < 3){
        return response.status(400).json({
            error: 'password have to be more than 3 characters long'
          })
      }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    user = new User({
        username: body.username,
        name: body.name,
        password: passwordHash,
    })
  } else{
    return response.status(400).json({
        error: 'password must be provided'
      })
  }
  
  let savedUser;
  try{
    savedUser = await user.save()
  } catch(error){
    next(error)
  }
  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1, likes: 1})
  response.json(users)
})

module.exports = usersRouter