import { AuthenticationError, UserInputError } from 'apollo-server-express';
import slugify from 'slugify';
import Post from '../../Models/post.js';
import { TOKEN_NOT_FOUND } from '../../lib/constants.js';
import uploadFileCloudinary from '../../utils/cloudinaryUpload.js';
import User from '../../Models/user.js';

const postResolvers = {
   Query: {
      getAllPosts: async (_, args, context) => {
         const {
            isAuth: { isAuth },
            client,
         } = context;

         console.log('is auht', isAuth);

         if (!isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }

         const posts = await Post.find({}).populate('user');

         return posts;
      },

      getUserPosts: async (_, { user }, context) => {
         const {
            isAuth: { isAuth },
            client,
         } = context;
         if (!isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }

         const foundUser = await User.findById(user);

         if (!foundUser) {
            throw new Error('User not found.');
         }

         const posts = await Post.find({
            user,
         }).populate('user');

         return posts;
      },

      getPost: async (parent, args, context) => {
         const {
            isAuth: { isAuth },
            client,
         } = context;
         if (!isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }

         const { _id } = args;

         const foundPost = await (
            await Post.findOne({
               _id,
            })
         ).populate('user');

         if (!foundPost) {
            throw new Error('Post not found.');
         }

         return foundPost;
      },
   },
   Mutation: {
      addPost: async (parent, args, context) => {
         try {
            const {
               isAuth: { isAuth },
               client,
            } = context;

            if (!isAuth) {
               throw new AuthenticationError(TOKEN_NOT_FOUND);
            }

            const { userId, title, subtitle, image, content, category } = args.data;

            if (!title || !content || !image || !subtitle || !userId) {
               throw new UserInputError('please fill required fields.');
            }

            const user = await User.findById(userId);

            if (!user) {
               throw new Error('user not found!');
            }

            const { file } = await image;

            const imageUrl = await uploadFileCloudinary(file);

            const newPost = new Post({
               user: userId,
               title,
               subtitle,
               content,
               category,
               image: imageUrl,
               slug: slugify(title),
            });

            const post = await (await newPost.save()).populate('user');

            return post;
         } catch (error) {
            console.log(error);
            throw new Error(error.message);
         }
      },
   },
};

export default postResolvers;
