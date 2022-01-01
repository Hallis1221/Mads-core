import { gql } from "apollo-server-micro";
import { adTypeDefs } from "./ad";
import { adDataTypeDefs } from "./adData";

export const typeDefs = [adTypeDefs,adDataTypeDefs];