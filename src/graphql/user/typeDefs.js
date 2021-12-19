import { gql } from 'apollo-server-express';

const userTypeDefs = gql`
   scalar Date

   type User {
      _id: ID!
      username: String
      email: String
      posts: [Post]
      token: String
      postCount: Int
      photo: String
      phone: String
      aboutMe: String
      job: String
      school: String
      gender: String
      instagramUrl: String
      twitterUrl: String
      githubUrl: String
      createdAt: Date
      birthDay: Date
      interests: [String]
      location: Location
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
      userId: ID!
      username: String
      job: String
      school: String
      about: String
      photo: String
      phone: String
      aboutMe: String
      gender: String
      instagramUrl: String
      twitterUrl: String
      githubUrl: String
      location: LocationInput
   }

   type Location {
      country: String
      city: String
   }

   input LocationInput {
      country: String
      city: String
   }

   # Get User With ID
   type Query {
      getUser(_id: ID!): User!
      getMeWithToken(token: String!): User!
   }

   # Mutations For User Auth
   type Mutation {
      register(input: RegisterInput): User!
      login(input: LoginInput): User!
      editProfile(input: UserPersonalInput): User!
   }
   type Subscription {
      updatedMe(input: UserPersonalInput): User!
   }
`;

export default userTypeDefs;
