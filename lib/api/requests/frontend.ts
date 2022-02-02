import { gql } from "graphql-request";
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
      `,
    )
  ).getAllContentHistoryQuery;
}

export async function createUserContent(content: {
  theme: string;
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
              skips
              views
              clicks
              contentID
            }
          }
        }
      `,
      {
        content: content,
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
            theme
            title
            link
          }
        }
      `,
      {
        getContentQueryId: contentID,
      }
    )
  ).getContentQuery;
}
