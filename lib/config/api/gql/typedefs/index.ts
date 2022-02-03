import { DocumentNode } from "graphql";
import { adTypeDefs } from "./ad";
import { adDataTypeDefs } from "./ad/data";
import { contentTypeDefs } from "./content";
import { contentDataTypeDefs } from "./content/data";
import { dataTypeDefs } from "./data";
import { waitlistTypeDefs } from "./waitlist";

const typeDefinitions: Array<DocumentNode> = [
  waitlistTypeDefs,
  dataTypeDefs,
  contentTypeDefs,
  contentDataTypeDefs,
  adTypeDefs,
  adDataTypeDefs,
];

export default typeDefinitions;
