const mongoose = require('mongoose')

const app = require('./app')

const mongoUrl = 'mongodb://Jarttu:bloglist@ac-h8pma42-shard-00-00.ax2t2ja.mongodb.net:27017,ac-h8pma42-shard-00-01.ax2t2ja.mongodb.net:27017,ac-h8pma42-shard-00-02.ax2t2ja.mongodb.net:27017/bloglist?ssl=true&replicaSet=atlas-354lx8-shard-0&authSource=admin&retryWrites=true&w=majority'

mongoose.connect(mongoUrl)
	.then(() => console.log('connected to MongoDB'))
	.catch(err => console.log(err))

const PORT = 3003
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})