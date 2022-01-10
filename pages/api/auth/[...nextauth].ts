import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/utils/auth/authConnection";
import { verifyRoles } from "../../../lib/logic/requests/frontend";

export default NextAuth({
  secret: process.env.NA_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GithubProvider({
      clientId: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
    }),
    EmailProvider({
      server:
        "smtp://" +
        process.env.SMTP_USERNAME +
        ":" +
        process.env.SMTP_PASSWORD +
        "@" +
        process.env.SMTP_SERVER +
        ":" +
        process.env.SMTP_PORT,
      from: process.env.EMAIL_FROM,
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
