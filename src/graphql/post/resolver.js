import { AuthenticationError, UserInputError } from 'apollo-server-express';
import slugify from 'slugify';
import { TOKEN_NOT_FOUND } from '../../lib/constants.js';
import Post from '../../Models/post.js';
import User from '../../Models/user.js';
import uploadFileCloudinary from '../../utils/cloudinaryUpload.js';
import { calculatePostReadTime } from '../../utils/helper.js';

const postResolvers = {
   Query: {
      getAllPostsByPage: async (_, args, context) => {
         const {
            isAuth: { isAuth },
         } = context;
         if (!isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }
         const { page, limit } = args;
         const posts = await Post.paginate({}, { page, limit, populate: 'user', sort: { createdAt: -1 } });
         return posts;
      },

      getUserPosts: async (_, { user }, context) => {
         const {
            isAuth: { isAuth },
            client: redisClient,
         } = context;

         if (!isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }

         const getCachedData = await redisClient.getAsync('getUserPosts');

         if (getCachedData) {
            return JSON.parse(getCachedData);
         }

         const foundUser = await User.findById(user);

         if (!foundUser) {
            throw new Error('User not found.');
         }

         const posts = await Post.find({
            user,
         }).populate('user');

         await redisClient.set('getUserPosts', JSON.stringify(posts));

         return posts;
      },

      getPost: async (parent, args, context) => {
         const {
            isAuth: { isAuth },
            client: redisClient,
         } = context;
         if (!isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }

         const { _id } = args;

         const getCachedData = await redisClient.getAsync('getPost');

         if (getCachedData) {
            return JSON.parse(getCachedData);
         }

         const foundPost = await Post.findOne({
            _id,
         }).populate('user');

         if (!foundPost) {
            throw new Error('Post not found.');
         }

         const updatedPost = await Post.findByIdAndUpdate(_id, {
            viewCount: foundPost.viewCount > 0 ? foundPost.viewCount + 1 : 1,
         }).populate('user');

         await redisClient.set('getPost', JSON.stringify(updatedPost));

         return updatedPost;
      },
   },
   Mutation: {
      addPost: async (parent, args, context) => {
         try {
            const {
               isAuth: { isAuth },
               pubsub,
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

            const imageUrl = await uploadFileCloudinary(image);

            const readTime = calculatePostReadTime(content);

            const newPost = new Post({
               user: userId,
               title,
               subtitle,
               content,
               category,
               image: imageUrl,
               slug: slugify(title),
               readTime,
            });

            const post = (await newPost.save()).populate('user');

            pubsub.publish('createdPost', {
               createdPost: post,
            });

            return post;
         } catch (error) {
            console.log(error);
            throw new Error(error.message);
         }
      },
      updatePost: async (info, { data }, context) => {
         const {
            isAuth: { isAuth },
            pubsub,
         } = context;

         const { image } = data;

         if (!isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }

         const foundPost = await Post.findById(data._id);

         if (!foundPost) {
            throw new Error('post not exists.');
         }

         let imageUrl = foundPost.image;

         if (image.file) {
            const { file } = image;
            const res = await uploadFileCloudinary(file);
            imageUrl = res;
         }

         const updatedPost = await Post.findByIdAndUpdate(data._id, { image: imageUrl, ...data }, { new: true });

         pubsub.publish('updatedPost', {
            updatedPost,
         });

         return updatedPost;
      },
      deletePost: async (info, { data }, context) => {
         const {
            isAuth: { isAuth },
            pubsub,
         } = context;

         if (!isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }

         const { _id, title, subtitle, image, content, category } = data;

         if (!_id || !title || !subtitle || !image || !category || !content) {
            throw new UserInputError('please fill required fields.');
         }

         const foundPost = await Post.findById(_id);

         if (!foundPost) {
            throw new Error('post not exists.');
         }

         const deletedPost = await Post.findByIdAndDelete(_id);

         pubsub.publish('deletedPost', {
            deletedPost,
         });

         return deletedPost;
      },
   },
   Subscription: {
      createdPost: {
         subscribe: (info, context) => {
            const { pubsub } = context;
            pubsub.asyncIterator(['createdPost']);
         },
      },
      updatedPost: {
         subscribe: (info, context) => {
            const { pubsub } = context;
            pubsub.asyncIterator(['deletedPost']);
         },
      },
      deletedPost: {
         subscribe: (info, context) => {
            const { pubsub } = context;
            pubsub.asyncIterator(['deletedPost']);
         },
      },
   },
};

export default postResolvers;
