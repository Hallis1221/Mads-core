import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/utils/auth/authConnection";

export default NextAuth({
  secret: process.env.NA_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GithubProvider({
      clientId: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
        console.log(credentials);
      return true;
    },
    async session({ session, user, token }) {
        console.log("user", user);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
        console.log(isNewUser)
      return token;
    },
  },
});
