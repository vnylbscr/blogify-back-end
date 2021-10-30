import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { GET_ALL_POSTS, GET_SINGLE_POST } from './queries.js';
import schema from '../../src/graphql/schema.js';

describe('POST resolvers', () => {
   const server = new ApolloServer({
      schema,
   });

   test('should get all post from database', async () => {
      const result = await server.executeOperation(
         {
            query: GET_ALL_POSTS,
         },
         () => ({
            isAuth: {
               isAuth: true,
            },
         })
      );
      expect(result?.data?.getAllPosts).toBe([]);
   });
});
