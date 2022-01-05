import { GraphQLClient } from "graphql-request";

// Create a GraphQL client with the host url provided by the .env.local file. If that doesn't exist, use the online production url.
// If that doesn't exist, use localhost, intended exlusivly for development and wont work in production, but useful incase a developer is offline and the app fails to read from .env.local.
export const gqc: GraphQLClient = new GraphQLClient(
  process.env.HOST ||
    "https://www.marketads.me/api/graphql" ||
    "http://localhost:3000/api/graphql"
);
