// import axios to make http requests
import axios from "axios";

export async function registerForCreatorWaitlistMutation(_: any, { email, URL }: any) {
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

