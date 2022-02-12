// This is a list of all the resolvers in our app, both queries and mutations.
// It is more readable to have the actual resolvers in a seperate file but they are referenced here in order to have it nice and tidy for our api endpoint.

import createAdMutation, { updateAdMutation } from "./mutations/ad";
import createAdDataMutation, { updateAdDataMutation } from "./mutations/ad/data";
import { createCreatorKeyMutation } from "./mutations/api";
import {
  createContentMutation,
  adminCreateContentMutation,
  updateContentMutation,
} from "./mutations/content";
import createContentDataMutation, { updateContentDataMutation } from "./mutations/content/data";
import {
  registerSkipsMutation,
  registerClicksMutation,
  registerViewsMutation,
} from "./mutations/register";
import {defaultUserMutation, createUserStripeIDMutation } from "./mutations/user";
import { registerForCreatorWaitlistMutation } from "./mutations/waitlist";
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
import { getAllContentHistoryQuery, getContentHistoryQuery } from "./queries/content/data/history/getContentHistory";
import { getUserStripeIDQuery, getUserStripeOnboardingLinkQuery, isCreatorQuery } from "./queries/user";
import { getUserInfoQuery } from "./queries/waitlist";

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
    getContentHistoryQuery,
    getAllContentHistoryQuery,

    // Ads
    getAdQuery,

    // Ad data
    getAdDataQuery,

    // Waitlist
    getUserInfoQuery,

    // User
    getUserStripeIDQuery,
    getUserStripeOnboardingLinkQuery,
  },

  Mutation: {
    // Waitlist
    registerForCreatorWaitlistMutation,

    // User
    defaultUserMutation,
    createUserStripeIDMutation,

    // Register
    registerSkipsMutation,
    registerClicksMutation,
    registerViewsMutation,

    // Content
    createContentMutation,
    adminCreateContentMutation,
    updateContentMutation,

    // Content data
    createContentDataMutation,
    updateContentDataMutation,

    // Ad
    createAdMutation,
    updateAdMutation,

    // Ad data
    createAdDataMutation,
    updateAdDataMutation,

    // Api
    createCreatorKeyMutation,
  },
};

export default resolvers;
