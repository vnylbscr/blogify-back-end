import { makeExecutableSchema } from '@graphql-tools/schema';
import FileTypeDefs from './file/typeDefs.js';
import { UserResolvers, UserTypeDefs } from './user/index.js';
import { PostResolvers, PostTypeDefs } from './post/index.js';
import { CommentResolvers, CommentTypeDefs } from './comment/index.js';

const typeDefs = [UserTypeDefs, PostTypeDefs, CommentTypeDefs, FileTypeDefs];
const resolvers = [UserResolvers, PostResolvers, CommentResolvers];

const schema = makeExecutableSchema({
   typeDefs,
   resolvers,
});

export default schema;
