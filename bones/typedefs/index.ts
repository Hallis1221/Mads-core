import { gql } from "apollo-server-micro";
import { adTypeDefs } from "./ad";
import { dataTypeDefs } from "./data";

export const typeDefs = [adTypeDefs,dataTypeDefs];