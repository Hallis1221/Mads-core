import axios from "axios";

export async function getUserInfoQuery(_: any, { email }: any) {
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