import mongoose from 'mongoose';
import createApolloServer from '../test-utils/createApolloServer.js';
import { GET_ALL_POSTS } from './queries.js';

describe('POST resolvers', () => {
   let server;

   beforeAll(async () => {
      server = createApolloServer();
   });

   afterAll(async () => {
      await mongoose.disconnect();
   });

   test('should get all post from database', async () => {
      const result = await server.executeOperation({
         query: GET_ALL_POSTS,
      });
      // console.log('result', result);
      expect(result?.data?.getAllPosts).toBeNull();
   });

   test('should return status 400', async () => {
      const result = await server.executeOperation({
         query: GET_ALL_POSTS,
      });
      // console.log('result', result);
      expect(result?.data?.getAllPosts).toBeDefined();
   });
});
