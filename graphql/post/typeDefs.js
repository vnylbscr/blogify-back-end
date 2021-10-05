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
   type Query {
      getAllPosts: [Post]
      getUserPosts(user: ID!): [Post]
      getPost(_id: ID!): Post!
   }
   type Mutation {
      addPost(data: PostInput): Post!
   }

   type Subscription {
      createdPost(data: SubscriptionInput): Post
      updatedPost(data: SubscriptionInput): Post
      deletedPost(data: SubscriptionInput): Post
   }

   input SubscriptionInput {
      token: String!
   }
`;

export default postTypeDefs;
