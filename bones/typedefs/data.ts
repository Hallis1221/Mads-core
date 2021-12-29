import { gql } from "apollo-server-micro";

export const dataTypeDefs = gql`
type Query {
    getData: [Data]!
    getAdData(adID: String!): Data!
  }

  type Mutation {
    createData(input: DataCreateInput): Data
    updateDataLimits(adID: String!, input: DataLimitsInput): Data
    updateData(adID: String!, input: DataInput): Data
    deleteData(adID: String!): Data
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
  input DataInput {
    clicks: Int!
    views: Int!
  }
`;
