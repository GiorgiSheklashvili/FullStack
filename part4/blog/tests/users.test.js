const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
  })


describe('when user is created', () => {
    test('username is present', async () => {
        const response = await api
            .post('/api/users')
            .send({
                "name": "john doe",
                "password": "1234567"
            })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(response.body.error).toContain('`username` is required')
    })
    test('throws error if username is shorter than 3 char long', async () => {
        const response = await api
            .post('/api/users')
            .send({
                "username": '12',
                "name": "john doe",
                "password": "1234567"
            })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(response.body.error).toContain('is shorter than the minimum allowed length')
    })
    test('username is at least 3 char long', async () => {
        await api
            .post('/api/users')
            .send({
                "username": "124",
                "name": "john doe",
                "password": "1234567"
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('password is present', async () => {
        const response = await api
            .post('/api/users')
            .send({
                "username": "john223",
                "name": "john doe"
            })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(response.body.error).toContain('password must be provided')
    })
    test('throws error if password is shorter than 3 char long', async () => {
        const response = await api
            .post('/api/users')
            .send({
                "username": 'john222',
                "name": "john doe",
                "password": "12"
            })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(response.body.error).toContain('password have to be more than 3 characters long')
    })
    test('password is at least 3 char long', async () => {
        await api
            .post('/api/users')
            .send({
                "username": 'john123',
                "name": "john doe",
                "password": "123"
            })
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})

afterAll(() => {
    mongoose.connection.close()
  })