import { gql } from "graphql-request";
import { correctPassword } from "../auth";
import { gqc } from "../network/client";

const mutation = gql`
  mutation Mutation($contentID: String!, $input: ContentDataInput) {
    updateContentData(contentID: $contentID, input: $input) {
      contentID
      clicks
    }
  }
`;

const query = gql`
  query Query($contentID: String!) {
    getContentData(contentID: $contentID) {
      clicks
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

// Export defualt function for registering a click. The function takes in ADid as a string as its only parameter.
export default function registerContentClick(contentID: string): void {
  gqc
    .request(query, {
      contentID: contentID,
      password: correctPassword,
    })
    .then(async (contentData) => {
      await incrementView(contentData);
    })
    .catch(async (_) => {
      await createContentData();
    });

  function createContentData() {
    gqc
      .request(createMutation, {
        input: {
          contentID,
          clicks: 0,
          views: 0,
          uploadDate: "null",
          password: correctPassword,
        },
      })
      .then((data) => {
        console.log(
          data.createContentData.title,
          ":",
          data.createContentData.id,
          "created as its contentdata was not found"
        );
        registerContentClick(data["createContentData"]["contentID"]);
      });
  }

  async function incrementView(contentData: any) {
    gqc
      .request(mutation, {
        contentID: contentID,
        input: {
          clicks: contentData.getContentData.clicks + 1,
          password: correctPassword,
        },
      })
      .then((data) => {
        if (
          data.updateContentData === null ||
          data.updateContentData === undefined
        ) {
          createContentData();
        }
      });
  }
}
