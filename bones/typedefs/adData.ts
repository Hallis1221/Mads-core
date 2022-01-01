import { gql } from "apollo-server-micro";

export const adDataTypeDefs = gql`
type Query {
    getAdsData: [AdData]!
    getAdData(adID: String!): AdData!
  }

  type Mutation {
    createAdData(input: AdDataCreateInput): AdData
    updateAdDataLimits(adID: String!, input: DataLimitsInput): AdData
    updateAdData(adID: String!, input: AdDataInput): AdData
    deleteAdData(adID: String!): AdData
  }

  type AdData {
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
  
  input AdDataCreateInput {
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
