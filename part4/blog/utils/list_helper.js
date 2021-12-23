let _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const max = blogs.reduce(function (prev, current) {
    return (prev.likes > current.likes) ? prev : current
  })
  return { title: max.title, author: max.author, likes: max.likes }
}

const mostBlogs = (blogs) => {
  const author = _.maxBy(blogs, 'author')
  const count = _.countBy(blogs, 'author')
  return { author: author.author, blogs: count[author.author] }
}

const mostLikes = (blogs) => {
  const author = _.maxBy(blogs, 'likes')
  const likes = blogs.filter(blog => blog.author === author.author).reduce((accumulator, currentValue) => accumulator + currentValue.likes, 0)
  return { author: author.author, likes: likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}