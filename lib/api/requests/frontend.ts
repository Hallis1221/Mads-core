import { gql } from "graphql-request";
import { gqc } from "../gql/client";

export async function isCreator(email: string) {
  return (await gqc.request(
    gql`
      query Query($email: String) {
        isCreatorQuery(email: $email)
      }
    `,
    { email: email }
  )).isCreatorQuery;
}
