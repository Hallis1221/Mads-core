// TODO rate limit

import { gql } from "graphql-request";
import { gqc } from "../../graphql/client";

export async function getContentWithID(id: string) {
  return (
    await gqc
      .request(
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
      )
      .catch((error) => {
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

export async function registerSkip(adID: string, contentID: string) {
  return gqc.request(
    gql`
      mutation Mutation($adId: ID!, $contentId: ID!) {
        registerSkips(adID: $adId, contentID: $contentId)
      }
    `,
    {
      adId: adID,
      contentId: contentID,
    }
  );
}

export async function registerForCreatorWaitlist(email: string, URL: string) {
  return (
    await gqc.request(
      gql`
        mutation Mutation($email: String!, $url: String!) {
          registerForCreatorWaitlist(email: $email, URL: $url) {
            referral_link
            current_priority
            registered_email
            total_users
            total_referrals
            user_id
          }
        }
      `,
      {
        email: email,
        url: URL,
      }
    )
  ).registerForCreatorWaitlist;
}

export async function checkUserInfo(email: string) {
  return (
    await gqc.request(
      gql`
        query Query($email: String!) {
          getUserInfo(email: $email) {
            current_priority
            referral_link
            registered_email
            user_id
            total_referrals
            total_users
          }
        }
      `,
      {
        email: email,
      }
    )
  ).getUserInfo;
}

export async function verifyRoles(email: any) {
  await gqc.request(
    gql`
      query Query($email: String) {
        checkAndDefaultRoles(email: $email)
      }
    `,
    {
      email: email,
    }
  );
}

export async function isCreator(email: string) {
  return (
    await gqc.request(
      gql`
        query Query($email: String!) {
          isCreator(email: $email)
        }
      `,
      {
        email: email,
      }
    )
  ).isCreator;
}
