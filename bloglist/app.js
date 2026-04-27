require('dotenv').config()

const express = require('express')
const Blog = require('./models/blog')
const usersRouter = require('./controllers/users')
const User = require('./models/user')
const loginRouter = require('./controllers/login')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

const app = express()

app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

app.get('/api/blogs', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

app.post('/api/blogs', async (request, response) => {
    const body = request.body

    const token = getTokenFrom(request)
    
    if (!token) {
        return response.status(401).json({ error: 'token missing' })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

app.delete('/api/blogs/:id', async(request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()

})

module.exports = app