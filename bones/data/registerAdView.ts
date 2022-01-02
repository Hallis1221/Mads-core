// TODO rate limit

import { gql } from "graphql-request";
import { correctPassword } from "../auth";
import { client } from "../network";

const mutation = gql`
  mutation Mutation($adID: String!, $input: AdDataInput) {
    updateAdData(adID: $adID, input: $input) {
      adID
      views
    }
  }
`;

const query = gql`
  query Query($adID: String!) {
    getAdData(adID: $adID) {
      views
    }
  }
`;

const createMutation = gql`
  mutation Mutation($input: AdDataCreateInput) {
    createAdData(input: $input) {
      adID
    }
  }
`;

// Export defualt function for registering a view. The function takes in ADid as a string as its only parameter.
export default async function registerAdView(id: any): Promise<void> {
  let adID = id;

  await client
    .request(query, {
      adID: adID,
      password: correctPassword,
    })
    .then(async (adData) => {
      await incrementView(adData);
    }).catch(async (_) => {
      await createAdData();
    });

  function createAdData() {
    client
      .request(createMutation, {
        input: {
          adID: adID,
          clicks: 0,
          maxClicks: 0,
          views: 0,
          maxViews: 0,
          startDate: "null",
          endDate: "null",
          password: correctPassword,
        },
      })
      .then((data) => {
        console.log(data.createAdData.title, ":",data.createAdData.id, "created as its addata was not found"); 
        registerAdView(data["createAdData"]["adID"]);
      });
  }

  async function incrementView(adData: any) {

    await client
      .request(mutation, {
        adID: adID,
        input: {
          views: adData.getAdData.views + 1,
          password: correctPassword,
        },
      })
      .then((data) => {
        if (data.updateAdData === null || data.updateAdData === undefined) {
          createAdData();
        }
      })
    }

}
