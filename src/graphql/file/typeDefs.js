import { gql } from 'apollo-server-express';

const fileTypeDefs = gql`
   scalar Upload
   type File {
      filename: String!
      mimetype: String!
      encoding: String!
   }
`;

export default fileTypeDefs;
