const { gql } = require("apollo-server-express");

const commentTypeDefs = gql`
    type Comment {
        id: ID!
        author: Author!
        comment: String!
        likeCount: [Int]
        createdAt: String!
    }
    extend type Query {
        getComments(postId: ID!): [Comment!]
    }
`;

const commentResolvers = {};
module.exports = {
    commentTypeDefs,
    commentResolvers,
};
