import { GraphQLClient } from "graphql-request";

export const gqc: GraphQLClient = new GraphQLClient(process.env.HOST || "https://mads.vercel.app/api/graphql" || "http://localhost:3000/api/graphql");