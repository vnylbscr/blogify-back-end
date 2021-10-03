import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema(
   {
      content: { type: String, defaultValue: null },
      postId: {
         type: Schema.Types.ObjectId,
         ref: 'Post',
      },
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'User',
      },
      likedCount: {
         type: Number,
         defaultValue: 0,
      },
   },
   { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema, 'Comment');

export default Comment;
