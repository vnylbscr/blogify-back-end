import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { TOKEN_NOT_FOUND } from '../../lib/constants.js';
import Comment from '../../Models/comment.js';

const commentResolvers = {
   Query: {
      getComments: async (_, args, context) => {
         const {
            isAuth: { isAuth },
            client: redisClient,
         } = context;

         if (!isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }
         const { post } = args;

         if (!post) throw new UserInputError('Fill required fields.');

         const getCachedData = await redisClient.getAsync('getPostComment');

         if (getCachedData) {
            return JSON.parse(getCachedData);
         }

         const comments = await Comment.find({
            post,
         }).populate('user post');

         await redisClient.set('getPostComment', comments);

         return comments;
      },
   },
   Mutation: {
      addComment: async (_, args, context) => {
         const {
            isAuth: { isAuth },
         } = context;
         if (!isAuth) {
            throw new AuthenticationError(TOKEN_NOT_FOUND);
         }

         const { post, content, user } = args;

         if (!post || !content || !user) throw new UserInputError('Fill required fields.');

         const newComment = new Comment({
            user,
            content,
            post,
         });

         const savedData = await newComment.save();

         return savedData;
      },
   },
};

export default commentResolvers;
