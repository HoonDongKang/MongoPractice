import { Router } from 'express'
import { Blog, User } from '../models/index.js'
import { isValidObjectId } from 'mongoose'
import commentRouter from './commentRoute.js'

const blogRouter = Router()

blogRouter.use('/:blogId/comment', commentRouter)

blogRouter.post('/', async (req, res) => {
  try {
    const { title, content, islive, userId } = req.body
    if (typeof title !== 'string')
      return res.status(400).send({ err: 'title is required' })
    if (typeof content !== 'string')
      return res.status(400).send({ err: 'content is required' })
    if (islive && typeof islive !== 'boolean')
      return res.status(400).send({ err: 'islive must be boolean' })
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: 'user ID is invalid' })
    let user = await User.findById(userId).lean()
    if (!user) return res.status(400).send({ err: 'user does not exist' })

    let blog = new Blog({ ...req.body, user })
    await blog.save()
    return res.send({ blog })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})
blogRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .limit(10)
      .populate([{ path: 'user' }, { path: 'comments', populate: 'user' }])
    return res.send({ blogs })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})
blogRouter.get('/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: 'user ID is invalid' })
    const blog = await Blog.findOne({ _id: blogId })
    return res.send({ blog })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})
blogRouter.put('/:blogId', async (req, res) => {
  try {
    const { title, content } = req.body
    const { blogId } = req.params
    if (typeof title !== 'string')
      return res.status(400).send({ err: 'title is required' })
    if (typeof content !== 'string')
      return res.status(400).send({ err: 'content is required' })
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: 'Blog ID is invalid' })

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { title, content },
      { new: true }
    )
    return res.send({ blog })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})
blogRouter.patch('/:blogId/live', async (req, res) => {
  try {
    const { islive } = req.body
    const { blogId } = req.params
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: 'Blog ID is invalid' })
    if (typeof islive !== 'boolean')
      return res.status(400).send({ err: 'islive must be boolean' })

    const blog = await Blog.findByIdAndUpdate(blogId, { islive }, { new: true })
    return res.send({ blog })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})
blogRouter.delete('/:blogId', async (req, res) => {
  try {
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})

export default blogRouter
