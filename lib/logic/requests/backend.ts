// !! all of these should be protected by a login check / password for now

import { gql } from "graphql-request";
import { gqc } from "../../graphql/client";
import { Ad } from "../../types/ad";
import { Match } from "../../types/match";

export async function getContentIDS(
  password: string
): Promise<{ id: string }[]> {
  return (
    await gqc.request(
      gql`
        query Query($input: PasswordInput) {
          getContents(input: $input) {
            id
          }
        }
      `,
      {
        input: {
          password: password,
        },
      }
    )
  ).getContents;
}

export async function getAdIDS(password: string): Promise<{ id: string }[]> {
  return (
    await gqc.request(
      gql`
        query Query($input: PasswordInput) {
          getAds(input: $input) {
            id
          }
        }
      `,
      {
        input: {
          password: password,
        },
      }
    )
  ).getAds;
}

export async function updateAdClicks(
  adID: string,
  clicks: number,
  password: string
): Promise<number> {
  return (
    await gqc.request(
      gql`
        mutation Mutation($adID: String!, $input: AdDataInput) {
          updateAdData(adID: $adID, input: $input) {
            adID
            clicks
          }
        }
      `,
      {
        adID: adID,
        input: {
          clicks: clicks,
          password: password,
        },
      }
    )
  ).updateAdData.clicks;
}

export async function getAdClicks(
  adID: string,
  password: string
): Promise<number> {
  return (
    await gqc.request(
      gql`
        query Query($adID: String!) {
          getAdData(adID: $adID) {
            clicks
          }
        }
      `,
      {
        adID: adID,
        password: password,
      }
    )
  ).getAdData.clicks;
}

export async function getAdSkips(
  adID: string,
  password: string
): Promise<number> {
  return (
    await gqc.request(
      gql`
        query Query($adID: String!) {
          getAdData(adID: $adID) {
            skips
          }
        }
      `,
      {
        adID: adID,
        password: password,
      }
    )
  ).getAdData.skips;
}

export async function updateAdSkips(
  adID: string,
  skips: number,
  password: string
): Promise<number> {
  return (
    await gqc.request(
      gql`
        mutation Mutation($adID: String!, $input: AdDataInput) {
          updateAdData(adID: $adID, input: $input) {
            adID
            skips
          }
        }
      `,
      {
        adID: adID,
        input: {
          skips: skips,
          password: password,
        },
      }
    )
  ).updateAdData.skips;
}

export async function createAdData(
  adID: string,
  password: string
): Promise<string> {
  return (
    await gqc.request(
      gql`
        mutation Mutation($input: AdDataCreateInput) {
          createAdData(input: $input) {
            adID
          }
        }
      `,
      {
        input: {
          adID: adID,
          clicks: 0,
          skips: 0,
          views: 0,
          matches: [{}],
          password: password,
        },
      }
    )
  ).createAdData;
}

export async function createContentData(
  contentID: string,
  password: string
): Promise<string> {
  return (
    await gqc.request(
      gql`
        mutation Mutation($input: ContentDataCreateInput) {
          createContentData(input: $input) {
            contentID
          }
        }
      `,
      {
        input: {
          contentID,
          clicks: 0,
          views: 0,
          skips: 0,
          password: password,
        },
      }
    )
  ).createContentData;
}

export async function getContentClicks(
  contentID: string,
  password: string
): Promise<number> {
  return (
    await gqc.request(
      gql`
        query Query($contentID: String!) {
          getContentData(contentID: $contentID) {
            clicks
          }
        }
      `,
      {
        contentID: contentID,
        password: password,
      }
    )
  ).getContentData.clicks;
}

export async function updateContentClicks(
  contentID: string,
  clicks: number,
  password: string
): Promise<number> {
  return (
    await gqc.request(
      gql`
        mutation Mutation($contentID: String!, $input: ContentDataInput) {
          updateContentData(contentID: $contentID, input: $input) {
            contentID
          }
        }
      `,
      {
        contentID: contentID,
        input: {
          clicks: clicks,
          password: password,
        },
      }
    )
  ).updateContentData.clicks;
}

export async function getContentViews(
  contentID: string,
  password: string
): Promise<number> {
  return (
    await gqc.request(
      gql`
        query Query($contentID: String!) {
          getContentData(contentID: $contentID) {
            views
          }
        }
      `,
      {
        contentID: contentID,
        password: password,
      }
    )
  ).getContentData.views;
}

export async function updateContentViews(
  contentID: string,
  views: number,
  password: string
): Promise<number> {
  return (
    await gqc.request(
      gql`
        mutation Mutation($contentID: String!, $input: ContentDataInput) {
          updateContentData(contentID: $contentID, input: $input) {
            contentID
            views
          }
        }
      `,
      {
        contentID: contentID,
        input: {
          views: views,
          password: password,
        },
      }
    )
  ).updateContentData.views;
}

export async function getContentSkips(
  contentID: string,
  password: string
): Promise<number> {
  return (
    await gqc.request(
      gql`
        query Query($contentID: String!) {
          getContentData(contentID: $contentID) {
            skips
          }
        }
      `,
      {
        contentID: contentID,
        password: password,
      }
    )
  ).getContentData.skips;
}

export async function updateContentSkips(
  contentID: string,
  skips: number,
  password: string
): Promise<number> {
  return (
    await gqc.request(
      gql`
        mutation Mutation($contentID: String!, $input: ContentDataInput) {
          updateContentData(contentID: $contentID, input: $input) {
            contentID
            skips
          }
        }
      `,
      {
        contentID: contentID,
        input: {
          skips: skips,
          password: password,
        },
      }
    )
  ).updateContentData.skips;
}

export async function getAdViews(
  adID: string,
  password: string
): Promise<number> {
  return (
    await gqc.request(
      gql`
        query Query($adID: String!) {
          getAdData(adID: $adID) {
            views
          }
        }
      `,
      {
        adID: adID,
        password: password,
      }
    )
  ).getAdData.views;
}

export async function updateAdViews(
  adID: string,
  views: number,
  password: string
): Promise<number> {
  return (
    await gqc.request(
      gql`
        mutation Mutation($adID: String!, $input: AdDataInput) {
          updateAdData(adID: $adID, input: $input) {
            adID
            views
          }
        }
      `,
      {
        adID: adID,
        input: {
          views: views,
          password: password,
        },
      }
    )
  ).updateAdData.views;
}

export async function findAd(
  tags: string[],
  theme: string,
  contentID: string,
  password: string
): Promise<Ad> {
  return (
    await gqc.request(
      gql`
        query Query($input: FindAdInput) {
          findAd(input: $input) {
            title
            link
            image
            video
            type
            owner {
              displayName
            }
            id
          }
        }
      `,
      {
        input: {
          tags,
          theme,
          password,
          contentID,
        },
      }
    )
  ).findAd;
}

export async function getAds(password: string): Promise<Array<any>> {
  return (
    await gqc.request(
      gql`
        query Query($input: PasswordInput) {
          getAds(input: $input) {
            theme
            type
            title
            link
            id
            image
            maxClicks
            maxViews
            video
            owner {
              uid
              displayName
            }
            tags {
              tag
              priority
            }
          }
        }
      `,
      {
        input: {
          password: password,
        },
      }
    )
  ).getAds;
}

export async function addAdMatch(adID: String, password: String, match: Match) {
  return await gqc.request(
    gql`
      mutation Mutation($adId: String!, $input: AddAdDataMatchInput) {
        addAdDataMatch(adID: $adId, input: $input) {
          adID
        }
      }
    `,
    {
      adId:adID,
      input: {
        begins: match.begins,
        ends: match.ends,
        contentID: match.contentID,
        password: password,
      },
    }
  );
}
