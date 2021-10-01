import { gql } from 'apollo-server-core';

const postTypeDefs = gql`
   type Post {
      _id: ID!
      title: String!
      content: String
      image: String
      comments: [Comment]
      category: [String]
      createdAt: String
      slug: String
   }
   input PostInput {
      userId: ID!
      title: String!
      content: String!
      cetegory: [String]
      image: String
   }
   extend type Query {
      getPost(_id: ID!): Post!
      getAllPosts: [Post!]
   }
   extend type Mutation {
      addPost(input: PostInput): Post!
   }
`;

export default postTypeDefs;
