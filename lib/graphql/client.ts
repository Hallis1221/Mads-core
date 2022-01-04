import { GraphQLClient } from "graphql-request";

export const gqc: GraphQLClient = new GraphQLClient(process.env.HOST || "https://www.marketads.me/api/graphql" || "http://localhost:3000/api/graphql");