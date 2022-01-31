const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

const Blog = require('../models/blog')
const User = require('../models/user')

beforeAll(async () => {
  await User.deleteMany({})
  const saltRounds = 10
  const passwordHash = await bcrypt.hash("123456", saltRounds)
  let tempUser = helper.initialUser
  tempUser.password = passwordHash
  let usr = await (new User(tempUser)).save()
  helper.initialBlogs[0].user = usr
  const response = await api.post('/api/login').send({"username": "user1",
  "password": "123456"}).set('Content-type', 'application/json')
  console.log(await User.find({}))
  token = response.body.token;
});

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
  
test('identifier field is called id', async () => {
    const dbBlogs = await helper.blogsInDb() 
    expect(dbBlogs[0].id).toBeDefined();
})

test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'testing post method',
      author: 'John Doe',
      url: 'http://google.com',
      likes : 5
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '.concat(token))
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain(
      'testing post method'
    )
  })

  test('blog is not added without authorization token', async () => {
    const newBlog = {
      title: 'testing post method without token',
      author: 'John Doe',
      url: 'http://google.com',
      likes : 5
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('if title and url is missing bad request returned', async () => {
    const newBlog = {
      author: 'John Doe',
      likes : 5
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '.concat(token))
      .send(newBlog)
      .expect(400)
  
  })

  test('blog without likes field defaults to 0', async () => {
    const newBlog = {
        title: 'without like title',
        author: 'John Doe',
        url: 'http://google.com'
    }
  
    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '.concat(token))
      .send(newBlog)
      .expect(200)
    
    expect(response.body.likes).toBe(0)
  })



describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }
    ]

    
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(helper.initialBlogs)
        expect(result).toBe(36)
    })

})

describe('most likes', () => {
    test('of blogs', () => {
        const mostLikesBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
          }
        const favouriteObject = listHelper.favoriteBlog(helper.initialBlogs)
        expect(favouriteObject).toEqual(mostLikesBlog)
    })
})

describe('most blogs', () => {
    test('of author', () => {
        const mostBlogsAuthor = {
            author: "Robert C. Martin",
            blogs: 3
          }
        const author = listHelper.mostBlogs(helper.initialBlogs)
        expect(author).toEqual(mostBlogsAuthor)
    })
})

describe('most likes', () => {
    test('of author', () => {
        const mostLikesAuthor = {
            author: "Edsger W. Dijkstra",
            likes: 17
          }
        const author = listHelper.mostLikes(helper.initialBlogs)
        expect(author).toEqual(mostLikesAuthor)
    })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'Bearer '.concat(token))
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })
})

describe('updating of a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({likes: 99})
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd[0].likes).toEqual(99)
  })
})

afterAll(() => {
    mongoose.connection.close()
  })