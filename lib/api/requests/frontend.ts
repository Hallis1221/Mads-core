import { gql } from "graphql-request";
import { Tag } from "../../types/tag";
import { gqc } from "../gql/client";

export async function isCreator(email: string) {
  return (
    await gqc.request(
      gql`
        query Query($email: String) {
          isCreatorQuery(email: $email)
        }
      `,
      { email: email }
    )
  ).isCreatorQuery;
}

export async function registerForCreatorWaitlist(email: string, URL: string) {
  return (
    await gqc.request(
      gql`
        mutation Mutation($email: String!, $url: String!) {
          registerForCreatorWaitlistMutation(email: $email, URL: $url) {
            referral_link
            current_priority
            registered_email
            total_users
            total_referrals
            user_id
          }
        }
      `,
      { email: email, url: URL }
    )
  ).registerForCreatorWaitlistMutation;
}

export async function getAllUserContent() {
  return (
    await gqc.request(
      gql`
        query Query {
          getAllContentHistoryQuery {
            contentID
          }
        }
      `
    )
  ).getAllContentHistoryQuery;
}

export async function getAllUserContentFull() {
  return (
    await gqc.request(
      gql`
        query Query {
          getAllContentHistoryQuery {
            contentID
            skips
            clicks
            views
            chartData {
              now {
                views
                clicks
                date
                skips
              }
              last {
                date
                skips
                clicks
                views
              }
            }
          }
        }
      `
    )
  ).getAllContentHistoryQuery;
}

export async function createUserContent(content: {
  title: string;
  link: string;
  tags: string[];
}) {
  return (
    await gqc.request(
      gql`
        mutation Mutation($content: LimitedContentInput!) {
          createContentMutation(content: $content) {
            data {
              contentID
            }
          }
        }
      `,
      {
        content: {
          title: content.title,
          link: content.link,
          tags: content.tags,
        },
      }
    )
  ).createContentMutation;
}

export async function getContentWithID(contentID: string) {
  return (
    await gqc.request(
      gql`
        query Query($getContentQueryId: String!) {
          getContentQuery(id: $getContentQueryId) {
            id
            theme
            title
            link
            tags {
              tag
            }
          }
        }
      `,
      {
        getContentQueryId: contentID,
      }
    )
  ).getContentQuery;
}

export async function getContentDataWithID(contentID: string) {
  return (
    await gqc.request(
      gql`
        query Query($contentId: String!) {
          getContentDataQuery(contentID: $contentId) {
            clicks
            views
            skips
          }
        }
      `,
      {
        contentId: contentID,
      }
    )
  ).getContentDataQuery;
}

export async function getContentHistory(contentID: string) {
  return (
    await gqc.request(
      gql`
        query GetContentHistoryQuery($contentId: String!, $apiKey: String) {
          getContentHistoryQuery(contentID: $contentId, apiKey: $apiKey) {
            skips
            clicks
            views
            contentID
            chartData {
              last {
                views
                clicks
                skips
                date
              }
              now {
                views
                clicks
                skips
                date
              }
            }
          }
        }
      `,
      {
        contentId: contentID,
      }
    )
  ).getContentHistoryQuery;
}

export async function registerView(contentID: string, adID: string) {
  return (
    await gqc.request(
      gql`
        mutation Mutation($adId: ID!, $contentId: ID!) {
          registerViewsMutation(adID: $adId, contentID: $contentId)
        }
      `,
      {
        adId: adID,
        contentId: contentID,
      }
    )
  ).registerViewsMutation;
}

export async function registerSkip(contentID: string, adID: string) {
  return (
    await gqc.request(
      gql`
        mutation Mutation($adId: ID!, $contentId: ID!) {
          registerSkipsMutation(adID: $adId, contentID: $contentId)
        }
      `,
      {
        adId: adID,
        contentId: contentID,
      }
    )
  ).registerSkipsMutation;
}

export async function registerClick(contentID: string, adID: string) {
  return (
    await gqc.request(
      gql`
        mutation Mutation($adId: ID!, $contentId: ID!) {
          registerClicksMutation(adID: $adId, contentID: $contentId)
        }
      `,
      {
        adId: adID,
        contentId: contentID,
      }
    )
  ).registerClicksMutation;
}

export async function createApiKey() {
  return (
    await gqc.request(
      gql`
        mutation Mutation {
          createCreatorKeyMutation
        }
      `
    )
  ).createCreatorKeyMutation;
}

export async function updateContent(
  contentID: string,
  content: {
    title: string;
    link: string;
    tags: string[];
  }
) {
  return (
    await gqc.request(
      gql`
        mutation Mutation($contentId: String!, $content: LimitedContentInput!) {
          updateContentMutation(contentID: $contentId, content: $content) {
            id
          }
        }
      `,
      {
        contentId: contentID,
        content: {
          title: content.title,
          link: content.link,
          tags: content.tags,
        },
      }
    )
  ).updateContentMutation;
}

export async function getStripeID() {
  return (
    await gqc.request(
      gql`
        query Query {
          getUserStripeIDQuery
        }
      `
    )
  ).getUserStripeIDQuery;
}

export async function getStripeOnboardingLink() {
  return (
    await gqc.request(
      gql`
        query Query {
          getUserStripeOnboardingLinkQuery
        }
      `
    )
  ).getUserStripeOnboardingLinkQuery;
}

export async function getEarnings() {
  return (
    await gqc.request(
      gql`
        query Query($apiKey: String) {
          calculateCreatorLifetimeEarningsQuery(apiKey: $apiKey)
        }
      `
    )
  ).calculateCreatorLifetimeEarningsQuery;
}
