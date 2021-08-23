const { gql } = require("apollo-server-express");

const userTypeDefs = gql`
    type User {
        id: ID!
        name: String
        email: String
        posts: [Post]
        type: Int
        createdAt: String
        token: String
        information: UserInformation
        avatar: String
    }
    type UserInformation {
        job: String!
        school: String!
        postCount: Int!
        about: String!
    }
    input RegisterInput {
        username: String!
        email: String!
        password: String!
    }
    input LoginInput {
        email: String!
        password: String!
    }
    input UserPersonalInput {
        job: String
        school: String
        postCount: Int
        about: String
        avatar: String
    }
    input EditUserInput {
        personalInfos: UserPersonalInput
        name: String
    }
    # Get User With ID
    extend type Query {
        getUser(userID: ID!): User!
        getMeWithToken(token: String!): User!
    }
    # Mutations For User Auth
    type Mutation {
        register(input: RegisterInput): User!
        login(input: LoginInput): User!
        editProfile(input: EditUserInput): User!
    }
`;

module.exports = userTypeDefs;
