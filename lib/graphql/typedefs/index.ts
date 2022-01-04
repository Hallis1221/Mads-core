import { gql } from "apollo-server-micro";
import { adTypeDefs } from "./ad";
import { adDataTypeDefs } from "./adData";
import { contentTypeDefs } from "./content";
import { contentDataTypeDefs } from "./contentData";
import { dataTypeDefs } from "./data";

export const typeDefinitions = [adTypeDefs,adDataTypeDefs, contentTypeDefs, contentDataTypeDefs,dataTypeDefs];