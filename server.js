import express from 'express'
import mongoose from 'mongoose'
import DB_CONFIG from './config/db.js'

const { DB_ID, DB_PW } = DB_CONFIG

const app = express()
const MONGO_URI = `mongodb+srv://${DB_ID}:${DB_PW}@mongopractice.vmtvpvu.mongodb.net/?retryWrites=true&w=majority`
const users = []

mongoose.connect(MONGO_URI).then((result) => console.log({ result }))

app.use(express.json())

app.get('/user', function (req, res) {
  res.send({ users: users })
})

app.post('/user', function (req, res) {
  users.push({ name: req.body.name, age: req.body.age })

  return res.send({ success: true })
})

app.listen(3000, function () {
  console.log('server listening on port 3000')
})
