import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import redis from 'redis';
import Bluebird from 'bluebird';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { PubSub } from 'graphql-subscriptions';
import Auth from './middleware/auth.js';
import schema from './graphql/schema.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

Bluebird.promisifyAll(redis.RedisClient.prototype);
Bluebird.promisifyAll(redis.Multi.prototype);

async function startApolloServer() {
   const client = redis.createClient(6379);
   const pubsub = new PubSub();

   const app = express();
   const httpServer = createServer(app);

   app.get('/', (req, res) => {
      res.redirect('/graphql');
   });

   app.use(
      graphqlUploadExpress({
         maxFiles: 4, // 4 file
         maxFileSize: 100000000, // 10 MB
      })
   );
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

   // Type Defs and Resolvers
   const server = new ApolloServer({
      schema,
      plugins: [
         {
            async serverWillStart() {
               return {
                  async drainServer() {
                     subscriptionServer.close(); //eslint-disable-line
                  },
               };
            },
         },
      ],
      context: ({ req }) => {
         const isAuth = Auth(req);
         return {
            isAuth,
            client,
            pubsub,
         };
      },
   });

   const subscriptionServer = SubscriptionServer.create(
      {
         schema,
         execute,
         subscribe,
      },
      {
         server: httpServer,
         path: server.graphqlPath,
      }
   );

   // Server Start
   await server.start();

   // Apply Middlaware
   server.applyMiddleware({ app });
   await new Promise((resolve) => app.listen({ port: PORT }, resolve));
   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
   return { server, app };
}

startApolloServer();
