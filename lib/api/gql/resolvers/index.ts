// This is a list of all the resolvers in our app, both queries and mutations.
// It is more readable to have the actual resolvers in a seperate file but they are referenced here in order to have it nice and tidy for our api endpoint.

import getAdQuery from "./queries/ad";
import getAdDataQuery from "./queries/ad/data";
import {
  getContentQuery,
  getContentsQuery,
  getUserContentQuery,
} from "./queries/content";
import {
  getContentDataQuery,
  getUserContentDataQuery,
  getContentDataMonthQuery,
  getLastContentDataQuery,
} from "./queries/content/data";
import { isCreatorQuery } from "./queries/user";

const resolvers = {
  Query: {
    // Creator
    isCreatorQuery,

    // Content
    getContentQuery,
    getContentsQuery,
    getUserContentQuery,

    // Content data
    getContentDataQuery,
    getUserContentDataQuery,
    getContentDataMonthQuery,
    getLastContentDataQuery,

    // Ads
    getAdQuery,

    // Ad data
    getAdDataQuery,
  },

  Mutation: {},
};

export default resolvers;
