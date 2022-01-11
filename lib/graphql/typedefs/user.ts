import { gql } from "apollo-server-micro";


export const userTypeDefs = gql`
  type Query {
    checkAndDefaultUser(email: String): Boolean
    isCreator(email: String): Boolean
  }
`;

