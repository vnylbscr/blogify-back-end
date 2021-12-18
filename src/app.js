import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import redis from 'redis';
import Bluebird from 'bluebird';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { PubSub } from 'graphql-subscriptions';
import cors from 'cors';
import Auth from './middleware/auth.js';
import schema from './graphql/schema.js';
import dbConnection from './utils/dbConnection.js';

dotenv.config();
Bluebird.promisifyAll(redis.RedisClient.prototype);
Bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(6379);

const startApolloServer = async () => {
   const pubsub = new PubSub();
   const app = express();
   const httpServer = createServer(app);

   dbConnection(process.env.DB_URL).then(() => {
      console.log('DB Connected Successfully');
   });
   app.use(cors());
   // Resolver map
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
   cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET_KEY,
   });

   const server = new ApolloServer({
      schema,
      context: ({ req }) => {
         const isAuth = Auth(req);
         return {
            isAuth,
            client,
            pubsub,
         };
      },
      formatError: (error) => {
         return {
            message: error.message,
            status: false,
            error: true,
         };
      },
      // formatResponse: (graphqlData) => ({
      //    data: graphqlData.data,
      //    status: true,
      //    code: graphqlData.http.status,
      // }),
   });
   await server.start();
   server.applyMiddleware({ app });

   SubscriptionServer.create({ schema, execute, subscribe }, { server: httpServer, path: server.graphqlPath });

   return httpServer;
};

export default startApolloServer;
