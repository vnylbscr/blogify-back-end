import { gql } from 'apollo-server-express';

const postTypeDefs = gql`
   type Post {
      _id: ID!
      title: String!
      subtitle: String
      content: String
      image: String
      comments: [Comment]
      category: [String]
      createdAt: String
      slug: String
      user: User
   }

   input PostInput {
      userId: ID!
      title: String!
      subtitle: String!
      content: String!
      category: [String]
      image: Upload!
   }
   extend type Query {
      getAllPosts: [Post]
      getUserPosts(user: ID!): [Post]
      getPost(_id: ID!): Post!
   }
   extend type Mutation {
      addPost(data: PostInput): Post!
   }
`;

export default postTypeDefs;
