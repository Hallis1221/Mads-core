// import axios to make http requests
import axios from "axios";

export async function registerForCreatorWaitlist(_: any, { email, URL }: any) {
  return await axios
    .post("https://getwaitlist.com/api/v1/waitlists/submit", {
      api_key: "PMD4UV",
      email: email,
      referral_link: URL,
    })
    .then((response) => {
      return response.data;
    })

    .catch(() => {
      return {
        exsits: false,
      };
    });
}

export async function getUserInfo(_: any, { email }: any) {
  return await axios
    .post("https://getwaitlist.com/api/v1/users/status", {
      api_key: "PMD4UV",
      email: email,
    })
    .then((response) => {
      return { ...response.data, exists: true };
    })

    .catch(() => {
      return {
        exsits: false,
      };
    });
}
