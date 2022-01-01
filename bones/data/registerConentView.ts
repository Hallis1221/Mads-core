import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:3000/api/ads/graphql");

const mutation = gql`
  mutation Mutation($contentID: String!, $input: ContentDataInput) {
    updateContentData(contentID: $contentID, input: $input) {
      contentID
    }
  }
`;

const query = gql`
  query Query($contentID: String!) {
    getContentData(contentID: $contentID) {
      views
    }
  }
`;

const createMutation = gql`
  mutation Mutation($input: ContentDataCreateInput) {
    createContentData(input: $input) {
      contentID
    }
  }
`;

// Export defualt function for registering a view. The function takes in ADid as a string as its only parameter.
export default function registerContentView(contentID: string): void {
  client
    .request(query, {
      contentID: contentID,
    })
    .then(
      (contentData) => {
        incrementView(contentData);
      },
      // on error
      (_) => {
        createContentData(registerContentView);
      }
    );

  function createContentData(registerContentView: (contentID: string) => void) {
    client
      .request(createMutation, {
        input: {
          contentID,
          clicks: 0,
          views: 0,
          uploadDate: "null",
        },
      })
      .then((data) => {
        registerContentView(data["createContentData"]["contentID"]);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function incrementView(contentData: any) {
    const prevViews = contentData["getContentData"]["views"];
    const newViews = prevViews + 1;

    client.request(mutation, {
      contentID: contentID,
      input: {
        views: newViews,
      },
    });
  }
}
