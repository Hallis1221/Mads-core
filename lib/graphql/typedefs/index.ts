import { adTypeDefs } from "./ad";
import { adDataTypeDefs } from "./adData";
import { contentTypeDefs } from "./content";
import { contentDataTypeDefs } from "./contentData";
import { dataTypeDefs } from "./data";

// Combine all the typeDefs into one array. 
export const typeDefinitions = [adTypeDefs,adDataTypeDefs, contentTypeDefs, contentDataTypeDefs,dataTypeDefs];