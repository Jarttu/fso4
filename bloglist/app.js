const express = require('express')
const Blog = require('./models/blog')

const app = express()

app.use(express.json())

app.get('/api/blogs', (request, response) => {
    Blog.find({}).then((blogs) => {
        response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog.save().then((result) => {
        response.status(201).json(result)
    })
})

app.delete('/api/blogs/:id', async(request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()

})

module.exports = app