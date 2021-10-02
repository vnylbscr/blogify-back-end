import { AuthenticationError, UserInputError } from 'apollo-server-express';
import slugify from 'slugify';
import Post from '../../Models/post.js';
import { TOKEN_NOT_FOUND } from '../../lib/constants.js';
import uploadFileCloudinary from '../../utils/cloudinaryUpload.js';

const postResolvers = {
   Query: {
      getAllPosts: async (_, __, context, info) => {
         if (!context.isauth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }
         const posts = await Post.find();
         return posts;
      },
      getPost: async (parent, args, context, info) => {
         if (context.isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }

         const { _id } = args;

         const foundPost = await Post.findOne({
            _id,
         });

         if (!foundPost) {
            throw new Error('Post not found.');
         }

         return foundPost;
      },
   },
   Mutation: {
      addPost: async (parent, args, context, info) => {
         try {
            if (!context.isAuth) {
               throw new AuthenticationError(TOKEN_NOT_FOUND);
            }
            const { userId, title, subtitle, image, content, category } = args.data;

            if (!title || !content || !image || subtitle) {
               throw new UserInputError('please fill required fields.');
            }
            const { file } = await image;

            const imageUrl = await uploadFileCloudinary(file);

            console.log('image url is', imageUrl);

            const newPost = new Post({
               user: userId,
               title,
               subtitle,
               content,
               category,
               image: Image,
               slug: slugify(title),
            });

            const post = await newPost.save();

            return post;
         } catch (error) {
            console.log(error);
            throw new Error('Ulaaa');
         }
      },
   },
};

export default postResolvers;
