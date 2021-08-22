const { gql } = require("apollo-server-express");

const fileTypeDefs = gql`
    type File {
        _id: String!
    }
`;

const resolvers = {};

module.exports = {
    fileTypeDefs,
    resolvers,
};
dd