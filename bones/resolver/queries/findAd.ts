import { gql } from "graphql-request";
import { client, correctPassword } from "../../auth";
import Ad from "../../models/ad";

const query = gql`
  query Query($input: PasswordInput) {
    getAds(input: $input) {
      theme
      id
      tags {
        tag
        priority
      }
    }
  }
`;

export default async function findAd(_: any, { input }: any) {
  const allAds: Array<any> = await client
    .request(query, {
      input: {
        password: correctPassword,
      },
    })
    .then((data) => {
      return data["getAds"];
    });

  // return if we have too few ads to iterate through
  if (1 >= allAds.length) return Ad.findOne({});

  // Narrow down the list of ads to only those that match the input theme
  let potentialAds: Array<any> = [];
  allAds.forEach((ad: any) => {
    if (ad.theme === input.theme) potentialAds.push(ad);
  });

  // return a random ad if we dont have any with matching theme
  if (potentialAds.length === 0) return Ad.findOne({});

  // return if we have too few ads to iterate through
  if (1 >= potentialAds.length) return potentialAds[0];

  // Sort the list of potential ads by their relevance, according to their tags and their tag priorities
  let winner: {score: number; ad: any} = {score: 0, ad: potentialAds[0]};
  potentialAds.forEach((ad: any) => {
    let adrelevance = 0;
    let hasMatch = ad.tags.some((tag: any) => input.tags.includes(tag.tag));
    if (hasMatch) {
      ad.tags.forEach((tag: any) => {
        if (input.tags.includes(tag.tag)) {
          adrelevance += tag.priority;
        }
      });
    }
    console.log(adrelevance);
    if (adrelevance > winner.score) {
      winner = {score: adrelevance, ad: ad};
    }
  });
  
  return winner.ad;
}
