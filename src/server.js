import express from 'express'
import mongoose from 'mongoose'
import DB_CONFIG from '../config/db.js'
import userRouter from './routes/userRoute.js'

const { DB_ID, DB_PW } = DB_CONFIG
const app = express()
const MONGO_URI = `mongodb+srv://${DB_ID}:${DB_PW}@mongopractice.vmtvpvu.mongodb.net/?retryWrites=true&w=majority`

const server = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    mongoose.set('debug', true)
    console.log('MongoDB connected')
    app.use(express.json())

    app.use('/user', userRouter)

    app.listen(3000, () => console.log('server listening on port 3000'))
  } catch (err) {
    console.error(err)
  }
}

server()
