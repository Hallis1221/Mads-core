// TODO rate limit

import { gql } from "graphql-request";
import { gqc } from "../../graphql/client";

export async function getContentWithID(id: string) {
  return (
    await gqc.request(
      gql`
        query Query($getContentId: ID!) {
          getContent(id: $getContentId) {
            theme
            tags {
              tag
            }
            title
            link
            id
            owner {
              displayName
            }
          }
        }
      `,
      {
        getContentId: id,
      }
    ).catch((error) => {
      console.error("error", error);
      return null;
    })
  ).getContent;
}

export async function pingContentData(contentID: string) {
  return (
    await gqc.request(
      gql`
        query GetContentData($contentId: String!) {
          getContentData(contentID: $contentId) {
            contentID
          }
        }
      `,
      {
        contentId: contentID,
      }
    )
  ).getContentData;
}

export async function pingAdData(adID: string) {
  return (
    await gqc.request(
      gql`
        query GetAdData($adId: String!) {
          getAdData(adID: $adId) {
            adID
          }
        }
      `,
      {
        adId: adID,
      }
    )
  ).getAdData;
}

export async function registerView(adID: string, contentID: string) {
  return gqc.request(
    gql`
      mutation Mutation($adId: ID!, $contentId: ID!) {
        registerViews(adID: $adId, contentID: $contentId)
      }
    `,
    {
      adId: adID,
      contentId: contentID,
    }
  );
}

export async function registerClick(adID: string, contentID: string) {
  return gqc.request(
    gql`
      mutation Mutation($adId: ID!, $contentId: ID!) {
        registerClicks(adID: $adId, contentID: $contentId)
      }
    `,
    {
      adId: adID,
      contentId: contentID,
    }
  );
}
