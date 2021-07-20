const { gql } = require("apollo-server-express");

const postTypeDefs = gql`
    type Post {
        id: ID!
        title: String!
        subtitle: String
        content: String!
        media: [String]
        author: Author!
        comments: [Comment!]
        category: [String]!
        createdAt: String
    }
    extend type Query {
        getPost(id: ID!): Post!
        getAllPosts: [Post!]
    }
`;

const postResolvers = {};

module.exports = {
    postTypeDefs,
    postResolvers,
};
