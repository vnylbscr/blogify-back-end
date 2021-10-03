import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import redis from 'redis';
import Auth from './middleware/auth.js';
import { UserTypeDefs, UserResolvers } from './graphql/user/index.js';
import { PostTypeDefs, PostResolvers } from './graphql/post/index.js';
import { CommentTypeDefs, CommentResolvers } from './graphql/comment/index.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

const client = redis.createClient();

async function startApolloServer() {
   // Construct a schema, using GraphQL schema language
   const typeDefs = gql`
      scalar Upload
      type File {
         filename: String!
         mimetype: String!
         encoding: String!
      }
   `;
   // redis
   client.on('error', (error) => {
      console.log(error);
   });
   // mongo
   mongoose
      .connect(process.env.DB_URL, {
         useUnifiedTopology: true,
         useNewUrlParser: true,
      })
      .then(() => console.log('MongoDB Connected.'))
      .catch((error) => console.log(error));
   // mongo db bağırma abi
   mongoose.set('useCreateIndex', true);

   cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET_KEY,
   });

   // Resolvers
   const resolvers = {};

   // Type Defs and Resolvers
   const server = new ApolloServer({
      typeDefs: [typeDefs, UserTypeDefs, PostTypeDefs, CommentTypeDefs],
      resolvers: [resolvers, UserResolvers, PostResolvers, CommentResolvers],
      context: ({ req }) => {
         const isAuth = Auth(req);
         return {
            isAuth,
            client,
         };
      },
   });

   // Server Start
   await server.start();
   const app = express();

   app.get('/', (req, res) => {
      res.redirect('/graphql');
   });

   app.use(
      graphqlUploadExpress({
         maxFiles: 4, // 4 file
         maxFileSize: 10000, // 10 MB
      })
   );
   // Apply Middlaware
   server.applyMiddleware({ app });
   await new Promise((resolve) => app.listen({ port: PORT }, resolve));
   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
   return { server, app };
}

startApolloServer();
