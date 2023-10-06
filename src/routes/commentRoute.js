import { Comment } from '../models/Comment.js'
import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { Blog, User } from '../models/index.js'

const commentRouter = Router({ mergeParams: true })

commentRouter.post('/', async (req, res) => {
  try {
    const { blogId } = req.params
    const { content, userId } = req.body
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: 'blog ID is not exist' })
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: 'user ID is not exist' })
    if (typeof content !== 'string')
      return res.status(400).send({ err: 'content is required' })

    const [blog, user] = await Promise.all([
      Blog.findById(blogId),
      User.findById(userId),
    ])

    if (!blog || !user)
      return res.status(400).send({ err: "blog or user doesn't exits" })
    if (!blog.islive)
      return res.status(400).send({ err: 'islive is not available' })

    const comment = await Comment({ content, blog, user, userFullName:`${user.name.first} ${user.name.last}` })
    await Promise.all([
      await comment.save(),
      await Blog.updateOne({_id: blogId }, { $push:{comment: comment} })
    ])
    return res.send(comment)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})
commentRouter.get('/', async (req, res) => {
  try {
    const { blogId } = req.params
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: 'blog ID is not exist' })
    const comments = await Comment.find({ blog: blogId })
    return res.send({ comments })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})
commentRouter.patch('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params
    const { content } = req.body

    if(typeof content !== 'string')
      return res.status(400).send({err:'content is required'})

    const [comment] = await Promise.all([
      Comment.findOneAndUpdate({_id:commentId},{content},{new:true}),
      Blog.updateOne({"comment._id":commentId},{"comment.$.content":content})
    ])
    return res.send({ comment })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})
export default commentRouter
