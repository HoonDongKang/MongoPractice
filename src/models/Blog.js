import { Schema, model, Types } from 'mongoose'
import { commentSchema } from './Comment.js'

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    user: { _id:{ type: Types.ObjectId, required: true, ref: 'user' },
            username: { type:String, required:true },
            name: {
              first: { type: String, required: true },
              last: { type: String, required: true },
            }
          },
    // comment:[ commentSchema ]
  },
  { timestamps: true }
)

// BlogSchema.virtual('comments', {
//   ref: 'comment',
//   localField: '_id',
//   foreignField: 'blog',
// })

// BlogSchema.set('toObject', { virtuals: true })
// BlogSchema.set('toJSON', { virtuals: true })

const Blog = model('blog', BlogSchema)

export default Blog
