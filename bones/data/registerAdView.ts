import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:3000/api/ads/graphql");

const mutation = gql`
  mutation Mutation($adID: String!, $input: AdDataInput) {
    updateAdData(adID: $adID, input: $input) {
      adID
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
// Export defualt function for registering a view. The function takes in ADid as a string as its only parameter.
export default function registerAdView(adID: string): void {
  client
    .request(query, {
      adID: adID,
    })
    .then(
      (adData) => {
        const prevViews = adData["getAdData"]["views"];
        const newViews = prevViews + 1;

        client
          .request(mutation, {
            adID: adID,
            input: {
              views: newViews,
            },
          })
          .catch((error) => {
            console.error(error);
          });
      },
      (error) => {
        console.error(error);
      }
    );
}
