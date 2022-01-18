import { gql } from 'apollo-server-express';

const commentTypeDefs = gql`
   type Comment {
      _id: ID
      content: String
      createdAt: Date
      post: Post
      user: User
   }
   type Query {
      getComments(post: ID!): [Comment]
   }
   type Mutation {
      addComment(post: ID!, content: String!, user: ID!): Comment!
   }
`;

export default commentTypeDefs;
