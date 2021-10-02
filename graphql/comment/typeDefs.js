import { gql } from 'apollo-server-express';

const commentTypeDefs = gql`
   type Comment {
      _id: ID
      content: String
      likedCount: Int
      createdAt: String
   }
   extend type Query {
      getComments(postId: ID!): [Comment]
   }
`;

export default commentTypeDefs;
