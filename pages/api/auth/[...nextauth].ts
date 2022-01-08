import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/utils/auth/authConnection";
import User from "../../../lib/models/user";
import { verifyRoles } from "../../../lib/logic/requests/frontend";

export default NextAuth({
  secret: process.env.NA_SECRET,
  adapter: MongoDBAdapter(clientPromise, ),
  providers: [
    GithubProvider({
      clientId: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      verifyRoles(user.email);
      return true;
    },

    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("is new user", isNewUser);
      return token;
    },
  },
});
