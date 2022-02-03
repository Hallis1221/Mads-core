import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/db/connect/connect";
import defaultUser from "../../../lib/server/user/defaultUser";

export default NextAuth({
  secret: process.env.NA_SECRET,
  adapter: MongoDBAdapter(clientPromise()),
  providers: [
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
      defaultUser(user.userID as string|| "");
      return true;
    },

    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("is new user", isNewUser);
      return token;
    },
  },
});
