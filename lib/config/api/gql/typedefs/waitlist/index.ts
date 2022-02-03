import { gql } from "apollo-server-micro";

export const waitlistTypeDefs = gql`
  type Mutation {
    registerForCreatorWaitlistMutation(
      email: String!
      URL: String!
    ): CreatorWaitlistReturn!
  }

  type Query {
    getUserInfoQuery(
      email: String!
    ): CreatorWaitlistReturn!
  }

  type CreatorWaitlistReturn {
    current_priority: String!
    referral_link: String!
    registered_email: String!
    user_id: String!
    total_referrals: Int!
    total_users: Int!
  }

  type CreatorWaitListInfo {
    exists: Boolean!
    current_priority: String
    referral_link: String
    registered_email: String
    user_id: String
    total_referrals: Int
    total_users: Int
  }
`;
