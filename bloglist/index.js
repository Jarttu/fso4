const express = require('express')
const mongoose = require('mongoose')

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = 'mongodb://Jarttu:bloglist@ac-h8pma42-shard-00-00.ax2t2ja.mongodb.net:27017,ac-h8pma42-shard-00-01.ax2t2ja.mongodb.net:27017,ac-h8pma42-shard-00-02.ax2t2ja.mongodb.net:27017/bloglist?ssl=true&replicaSet=atlas-354lx8-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(mongoUrl, { family: 4 })

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

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})