import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:3000/api/ads/graphql");

const mutation = gql`
  mutation Mutation($adId: String!, $input: DataInput) {
    updateData(adID: $adId, input: $input) {
      adID
    }
  }
`;

const query = gql`
  query Query($adId: String!) {
    getAdData(adID: $adId) {
      views
    }
  }
`;
// Export defualt function for registering a view. The function takes in ADid as a string as its only parameter.
export default function registerView(adID: string): void {
  client
    .request(query, {
      adId: adID,
    })
    .then(
      (data) => {
        const prevViews = data["getAdData"]["views"];
        const newViews = prevViews + 1;

        client
          .request(mutation, {
            adId: adID,
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
