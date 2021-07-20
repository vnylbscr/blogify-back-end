const { gql } = require("apollo-server-express");

const authorTypeDefs = gql`
    type Author {
        userID: ID!
        name: String
    }
    extend type Query {
        getAuthors: [Author]
    }
`;

const authorResolvers = {};

module.exports = {
    authorTypeDefs,
    authorResolvers,
};
