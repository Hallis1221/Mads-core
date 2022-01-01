import { gql } from "apollo-server-micro";
import { adTypeDefs } from "./ad";
import { adDataTypeDefs } from "./adData";
import { contentTypeDefs } from "./content";
import { contentDataTypeDefs } from "./contentData";

export const typeDefs = [adTypeDefs,adDataTypeDefs, contentTypeDefs, contentDataTypeDefs];