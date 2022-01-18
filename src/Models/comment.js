import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema(
   {
      content: { type: String, defaultValue: null },
      post: {
         type: Schema.Types.ObjectId,
         ref: 'Post',
      },
      user: {
         type: Schema.Types.ObjectId,
         ref: 'User',
      },
   },
   { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema, 'Comment');

export default Comment;
