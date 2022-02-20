import { DocumentNode } from "graphql";
import { adTypeDefs } from "./ad";
import { adDataTypeDefs } from "./ad/data";
import { contentTypeDefs } from "./content";
import { contentDataTypeDefs } from "./content/data";
import { creatorTypeDefs } from "./creator";
import { dataTypeDefs } from "./data";
import { userTypeDefs } from "./user";
import { waitlistTypeDefs } from "./waitlist";

const typeDefinitions: Array<DocumentNode> = [
  waitlistTypeDefs,
  dataTypeDefs,
  contentTypeDefs,
  contentDataTypeDefs,
  adTypeDefs,
  userTypeDefs,
  creatorTypeDefs,
  adDataTypeDefs,
];

export default typeDefinitions;
