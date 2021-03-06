import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import Comment from './comment.js';

const { Schema } = mongoose;

const postSchema = new Schema(
   {
      title: { type: String, defaultValue: null },
      subtitle: {
         type: String,
         defaultValue: null,
      },
      image: {
         type: String,
         defaultValue: null,
      },
      content: String,
      comments: {
         type: Schema.Types.ObjectId,
         ref: 'Comment',
      },
      category: [String],
      user: {
         type: Schema.Types.ObjectId,
         ref: 'User',
      },
      slug: {
         type: String,
         defaultValue: null,
      },
      commentCount: {
         type: Number,
         defaultValue: null,
      },
      likedCount: {
         type: Number,
         defaultValue: null,
      },
      readTime: {
         type: Number,
         defaultValue: null,
      },
      likedUsers: [
         {
            type: Schema.Types.ObjectId,
            ref: 'User',
         },
      ],
      viewCount: {
         type: Number,
         defaultValue: 0,
      },
   },
   { timestamps: true }
);

postSchema.plugin(mongoosePaginate);

postSchema.pre('remove', (next) => {
   Comment.remove(
      {
         postId: this._id,
      },
      next
   );
});

const Post = mongoose.model('Post', postSchema, 'Post');

export default Post;
