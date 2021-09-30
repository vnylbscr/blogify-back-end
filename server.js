import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { userResolvers, userTypeDefs } from './graphql/typeDefs/user/index.js';
import { postTypeDefs, postResolvers } from './graphql/typeDefs/post.js';
import { commentTypeDefs, commentResolvers } from './graphql/typeDefs/comment.js';
import { Auth } from './middleware/auth.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

async function startApolloServer() {
   // Construct a schema, using GraphQL schema language
   const typeDefs = gql`
      type Query {
         hello: String
      }
      type Book {
         id: ID!
         name: String!
      }
   `;

   mongoose
      .connect(process.env.DB_URL, {
         useUnifiedTopology: true,
         useNewUrlParser: true,
      })
      .then(() => console.log('MongoDB Connected.'))
      .catch((error) => console.log(error));
   // mongo db bağırma abi
   mongoose.set('useCreateIndex', true);

   // Resolvers
   const resolvers = {
      Query: {
         hello: () => 'Hello World!',
      },
   };

   // Type Defs and Resolvers
   const server = new ApolloServer({
      typeDefs: [typeDefs, userTypeDefs, postTypeDefs, commentTypeDefs],
      resolvers: [resolvers, userResolvers, postResolvers, commentResolvers],
      context: Auth,
   });

   // Server Start
   await server.start();
   const app = express();

   app.get('/', (req, res) => {
      res.redirect('/graphql');
   });
   // Auth Middleware
   app.use((req, res, next) => {
      // const fullToken = req.headers.authorization;
      // if (!fullToken) {
      //     res.status(400).json({
      //         message: "Token bulunamadı",
      //     });
      // } else {
      //     next();
      // }
      console.log('Header Token', req.headers.authorization);
      next();
   });
   // Apply Middlaware
   server.applyMiddleware({ app });
   await new Promise((resolve) => app.listen({ port: PORT }, resolve));
   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
   return { server, app };
}

startApolloServer();
