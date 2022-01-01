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

const createMutation = gql`
  mutation Mutation($input: AdDataCreateInput) {
    createAdData(input: $input) {
      adID
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
      },
      (_) => {
    
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
              },
            })
            .then((data) => {
              registerAdView( data["createAdData"]["adID"]);
            })
            .catch((error) => {
              console.error(error);
            });
     
      }
    );
}
