import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new Schema(
   {
      content: { type: String, defaultValue: null },
      postId: {
         type: Schema.Types.ObjectId,
         ref: 'posts',
      },
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'users',
      },
      likedCount: {
         type: Number,
         defaultValue: 0,
      },
   },
   { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
