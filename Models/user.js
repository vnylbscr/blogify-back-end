import mongoose from 'mongoose';

const { Schema } = mongoose;
const userSchema = new Schema(
   {
      username: {
         type: String,
         unique: true,
      },
      email: {
         type: String,
         defaultValue: null,
         unique: true,
      },
      posts: [
         {
            type: Schema.Types.Mixed,
            ref: 'Post',
         },
      ],
      password: { type: String, required: true },
      twitterUrl: {
         type: String,
         defaultValue: null,
      },
      githubUrl: {
         type: String,
         defaultValue: null,
      },
      instagramUrl: {
         type: String,
         defaultValue: null,
      },
      aboutMe: {
         type: String,
         defaultValue: null,
      },
      phone: {
         type: String,
         defaultValue: null,
      },
      photo: {
         type: String,
         defaultValue: null,
      },
      job: {
         type: String,
         defaultValue: null,
      },
      school: {
         type: String,
         defaultValue: null,
      },
      gender: {
         type: String,
         enum: ['male', 'female', 'not specified'],
         default: 'not specified',
      },
   },
   { timestamps: true }
);

const User = mongoose.model('User', userSchema, 'Users');

export default User;
