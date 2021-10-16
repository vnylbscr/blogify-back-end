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
      readTime: String
   }

   input PostInput {
      userId: ID!
      title: String!
      subtitle: String!
      content: String!
      category: [String]
      image: Upload!
   }

   input UpdatePostInput {
      _id: ID!
      title: String
      subtitle: String
      content: String
      category: [String]
      image: Upload
   }
   type Query {
      getAllPosts: [Post]
      getAllPostsByPage(page: Int, limit: Int): PostPaginator!
      getUserPosts(user: ID!): [Post]
      getPost(_id: ID!): Post!
   }

   type Mutation {
      addPost(data: PostInput): Post!
      updatePost(data: UpdatePostInput): Post!
      deletePost(postId: ID!): Post!
   }

   type Subscription {
      createdPost(data: SubscriptionInput!): Post
      updatedPost(data: SubscriptionInput!): Post
      deletedPost(data: SubscriptionInput!): Post
   }

   type PostPaginator {
      docs: [Post]
      totalDocs: Int
      limit: Int
      page: Int
      totalPages: Int
      hasNextPage: Boolean
      nextPage: Int
      hasPrevPage: Boolean
      prevPage: Int
      pagingCounter: Int
   }

   input SubscriptionInput {
      token: String!
   }
`;

export default postTypeDefs;
