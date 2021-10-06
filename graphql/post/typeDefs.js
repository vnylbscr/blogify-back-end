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
      likedCount: Int
      commentCount: Int
      likedUsers: [User]
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
      getAllPostsByPage(page: Int, limit: Int): PostPagination!
      getUserPosts(user: ID!): [Post]
      getPost(_id: ID!): Post!
   }

   type Mutation {
      addPost(data: PostInput): Post!
   }

   type Subscription {
      createdPost(data: SubscriptionInput!): Post
      updatedPost(data: SubscriptionInput!): Post
      deletedPost(data: SubscriptionInput!): Post
   }

   type PostPagination {
      posts: [Post]
      paginator: Paginator
   }

   type Paginator {
      data: [Post]
      totalDocsCount: Int
      limit: Int
      hasPrevPage: Boolean
      hasNextPage: Boolean
      pageNumber: Int
      currentPage: Int
   }

   input SubscriptionInput {
      token: String!
   }
`;

export default postTypeDefs;
