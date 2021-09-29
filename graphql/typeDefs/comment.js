const { gql } = require("apollo-server-express");

const commentTypeDefs = gql`
    type Comment {
        _id: ID
        content: String
        likedCount: [Int]
        createdAt: String
    }
    extend type Query {
        getComments(postId: ID!): [Comment]
    }
`;

const commentResolvers = {};
module.exports = {
    commentTypeDefs,
    commentResolvers,
};
