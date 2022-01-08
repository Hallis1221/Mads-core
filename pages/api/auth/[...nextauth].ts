import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: "eda0afe5df53ec0ce59f",
      clientSecret: "65a681eb97b061024cb579f4a452a15a0d0aace5",
    }),
  ],
});
