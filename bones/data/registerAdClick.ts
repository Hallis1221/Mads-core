// TODO rate limit

import { gql } from "graphql-request";
import { correctPassword } from "../auth";
import { gqc } from "../network/client";

const mutation = gql`
  mutation Mutation($adID: String!, $input: AdDataInput) {
    updateAdData(adID: $adID, input: $input) {
      adID
      clicks
    }
  }
`;

const query = gql`
  query Query($adID: String!) {
    getAdData(adID: $adID) {
      clicks
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

// Export defualt function for registering a click. The function takes in ADid as a string as its only parameter.
export default async function registerAdClick(adID: any): Promise<void> {
  await gqc
    .request(query, {
      adID: adID,
      password: correctPassword,
    })
    .then(async (adData) => {
      await incrementClick(adData);
    })
    .catch(async (_) => {
      await createAdData();
    });

  function createAdData() {
    gqc
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
        console.log(
          data.createAdData.title,
          ":",
          data.createAdData.id,
          "created as its addata was not found"
        );
        registerAdClick(data["createAdData"]["adID"]);
      });
  }

  async function incrementClick(adData: any) {
    await gqc
      .request(mutation, {
        adID: adID,
        input: {
          clicks: adData.getAdData.clicks + 1,
          password: correctPassword,
        },
      })
      .then((data) => {
        if (data.updateAdData === null || data.updateAdData === undefined) {
          createAdData();
        }
      });
  }
}
