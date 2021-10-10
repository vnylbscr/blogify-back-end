import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import schema from '../graphql/schema.js';
import postResolvers from '../graphql/post/resolver.js';
import { GET_ALL_POSTS, GET_SINGLE_POST } from './queries.js';
import Auth from '../middleware/auth.js';

describe('POST resolvers', () => {
   const server = new ApolloServer({
      schema,
      context: ({ req }) => {
         const isAuth = Auth(req);
         return {
            isAuth,
         };
      },
   });
   beforeAll(async () => {
      mongoose
         .connect(process.env.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
         })
         .then(() => console.log('MongoDB Connected.'))
         .catch((error) => console.log(error));
      mongoose.set('useCreateIndex', true);

      cloudinary.v2.config({
         cloud_name: process.env.CLOUD_NAME,
         api_key: process.env.CLOUD_API_KEY,
         api_secret: process.env.CLOUD_API_SECRET_KEY,
      });
   });

   test('should get all post from database', async () => {
      const result = await server.executeOperation({
         query: GET_SINGLE_POST,
         variables: {
            _id: '1',
         },
      });
      expect(result).toEqual('post not found');
   });
});
