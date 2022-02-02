import { gql } from "graphql-request";
import { gqc } from "../gql/client";

export async function isCreator(email: string) {
  return (
    await gqc.request(
      gql`
        query Query($email: String) {
          isCreatorQuery(email: $email)
        }
      `,
      { email: email }
    )
  ).isCreatorQuery;
}

export async function registerForCreatorWaitlist(email: string, URL: string) {
  return (
    await gqc.request(
      gql`
        mutation Mutation($email: String!, $url: String!) {
          registerForCreatorWaitlistMutation(email: $email, URL: $url) {
            referral_link
            current_priority
            registered_email
            total_users
            total_referrals
            user_id
          }
        }
      `,
      { email: email, url: URL }
    )
  ).registerForCreatorWaitlistMutation;
}
