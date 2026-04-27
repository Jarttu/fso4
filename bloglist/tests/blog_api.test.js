const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const mongoUrl = 'mongodb://Jarttu:bloglist@ac-h8pma42-shard-00-00.ax2t2ja.mongodb.net:27017,ac-h8pma42-shard-00-01.ax2t2ja.mongodb.net:27017,ac-h8pma42-shard-00-02.ax2t2ja.mongodb.net:27017/bloglist?ssl=true&replicaSet=atlas-354lx8-shard-0&authSource=admin&retryWrites=true&w=majority'

before(async () => {
    await mongoose.connect(mongoUrl)
})

describe('blog api', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})

        const blog = new Blog({
            title: 'Test blog',
            author: 'Tester',
            url: 'http://example.com',
            likes: 5
        })

        await blog.save()
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, 1)
    })

    test('blogs have id field instead of _id', async () => {
        const response = await api.get('/api/blogs')

        const blog = response.body[0]
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'asynctest',
            author: 'Tester',
            url: 'http://asynctest.com',
            likes: 3
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, 2)
        const titles = response.body.map(b => b.title)
        assert.ok(titles.includes('asynctest'))
    })
})

after(async () => {
    await mongoose.connection.close()
})