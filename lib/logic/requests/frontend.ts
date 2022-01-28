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

export async function pingContentData(contentID: string, password: string) {
  return (
    await gqc.request(
      gql`
        query GetContentData($contentId: String!, $password: String!) {
          getContentData(contentID: $contentId, password: $password) {
            contentID
          }
        }
      `,
      {
        contentId: contentID,
        password: password,
      }
    )
  ).getContentData;
}

export async function getCreatorPerformance(
  userID: string | undefined = undefined,
  password: string | undefined = undefined
) {
  if (!userID || !password) {
    console.log("Getting creator performance without userID or password");
    return await gqc.request(
      gql`
        query GetUserContentPerformances($userId: ID, $password: String) {
          getUserContentPerformances(userID: $userId, password: $password) {
            contentID
            clicks
            views
            skips
          }
        }
      `
    );
  }
  return await gqc.request(
    gql`
      query GetUserContentPerformances($userId: ID, $password: String) {
        getUserContentPerformances(userID: $userId, password: $password) {
          contentID
          clicks
          views
          skips
        }
      }
    `,
    {
      userId: userID,
      password: password,
    }
  );
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

export async function verifyUser(email: any) {
  await gqc.request(
    gql`
      query Query($email: String) {
        checkAndDefaultUser(email: $email)
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

export async function createUserContent(
  title: string,
  link: string,
  tags: string[]
) {
  return await gqc.request(
    gql`
      mutation Mutation($input: UserContentInput) {
        userCreateContent(input: $input,) {
          content {
            id
          }
        }
      }
    `,
    {
      input: {
        title: title,
        link: link,
        tags: tags,
      },
    }
  );
}
