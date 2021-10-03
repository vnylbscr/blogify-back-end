import mongoose from 'mongoose';

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
      category: Schema.Types.Mixed,
      user: {
         type: Schema.Types.ObjectId,
         ref: 'User',
      },
      slug: {
         type: String,
         defaultValue: null,
      },
   },
   { timestamps: true }
);

const Post = mongoose.model('Post', postSchema, 'Post');

export default Post;
