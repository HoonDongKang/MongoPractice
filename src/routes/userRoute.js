import { Router } from 'express'
import { User } from '../models/index.js'
import mongoose from 'mongoose'

const userRouter = Router()

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find()
    return res.send({ users })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})

userRouter.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: 'Invaid User ID' })
    const user = await User.findOne({ _id: userId })
    return res.send({ user })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})

userRouter.post('/', async (req, res) => {
  try {
    const { username, name } = req.body
    if (!username) return res.status(400).send({ err: 'username is required' })
    if (!name || !name.first || !name.last)
      return res
        .status(400)
        .send({ err: 'Both first and last names are required' })
    const user = new User(req.body)
    await user.save()
    return res.send({ user })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})

userRouter.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: 'Invaid User ID' })
    const user = await User.findOneAndDelete({ _id: userId })
    return res.send({ user })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})

userRouter.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { age, name } = req.body
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: 'Invaid User ID' })
    if (!age && !name)
      return res.status(400).send({ err: 'age or name is required' })
    if (age && typeof age !== 'number')
      return res.status(400).send({ err: 'age must be a number' })
    if (name && typeof name.first !== 'string' && typeof name.last !== 'string')
      return res.status(400).send({ err: 'first and last name must be string' })
    let user = await User.findById(userId)
    if (age) user.age = age
    if (name) user.name = name
    await user.save()
    // const user = await User.findByIdAndUpdate(
    //   userId,
    //   { age, name },
    //   { new: true }
    // )
    return res.send({ user })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})

export default userRouter
