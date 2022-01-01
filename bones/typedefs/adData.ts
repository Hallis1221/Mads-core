import { gql } from "apollo-server-micro";

export const adDataTypeDefs = gql`
type Query {
    getAdsData: [Data]!
    getAdData(adID: String!): Data!
  }

  type Mutation {
    createAdData(input: DataCreateInput): Data
    updateAdDataLimits(adID: String!, input: DataLimitsInput): Data
    updateAdData(adID: String!, input: AdDataInput): Data
    deleteAdData(adID: String!): Data
  }

  type Data {
    adID: String!
    clicks: Int!
    maxClicks: Int!
    views: Int!
    maxViews: Int!
    startDate: String!
    endDate: String!
  }

  input DataLimitsInput {
    maxClicks: Int!
    maxViews: Int!
    startDate: String!
    endDate: String!
  }
  
  input DataCreateInput {
    adID: String!
    clicks: Int!
    maxClicks: Int!
    views: Int!
    maxViews: Int!
    startDate: String!
    endDate: String!
  }
  input AdDataInput {
    clicks: Int
    views: Int
  }
`;
