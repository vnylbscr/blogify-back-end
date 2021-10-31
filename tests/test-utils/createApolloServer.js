import { ApolloServer } from 'apollo-server-express';
import schema from '../../src/graphql/schema.js';

const createApolloServer = (isAuth = false) =>
   new ApolloServer({
      schema,
      context: () => ({
         isAuth: {
            isAuth,
         },
         pubsub: null,
         client: null,
      }),
   });

export default createApolloServer;
