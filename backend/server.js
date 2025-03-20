const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors')
const projectRoutes = require('./routes/projects')
const taskRoutes = require('./routes/tasks')
const resourceRoutes = require('./routes/resources')
const userRoutes = require('./routes/users')
require('dotenv').config()

const app = express()
const PORT = 7460
const MONGO_URL = process.env.MONGO_URL

app.use(cors())
app.use(express.json())

mongoose.connect(MONGO_URL)
.then(()=>{console.log('MongoDb is Connected')})
.catch((err)=> console.log(err))

app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/users', userRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is Running on PORT ${PORT}`)
})