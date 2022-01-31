const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({}).populate('user', { username: 1, name: 1 })
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    let decodedToken
    try{
        decodedToken = jwt.verify(request.token, process.env.SECRET)
    } catch(error){
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    try{
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog)
    } catch(error) {
        console.log(error)
        response.status(400).end()
    }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    let decodedToken
    try{
        decodedToken = jwt.verify(request.token, process.env.SECRET)
    } catch(error){
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === request.user.id.toString() ){
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        return response.status(401).json({ error: decodedToken.id.toString().concat('is not creator of this blog') })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
  
    const blog = {
        title: body.title,
        likes: body.likes
    }
  
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  })

module.exports = blogsRouter