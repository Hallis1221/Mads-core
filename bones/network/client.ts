import { GraphQLClient } from "graphql-request";

export const gqc: GraphQLClient = new GraphQLClient("http://localhost:3000/api/graphql" );