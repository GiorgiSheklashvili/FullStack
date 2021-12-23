const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

module.exports = mongoose.model('Blog', blogSchema)