import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/db/connect/connect";
import defaultUser from "../../../lib/server/user/defaultUser";
import { logger } from "../../../lib/log";

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
      logger.debug(`Signing in user: ${user.email} with account: ${account}`);
      logger.info(`Defaulting user: ${user.email}.`);
      defaultUser((user.userID as string) || "");
      return true;
    },

    async jwt({ token, user, account, profile, isNewUser }) {
      logger.debug(
        `JWT: ${token} used for user: ${user?.userID}. The user is new: ${isNewUser}. Their account is: ${account} and their profile is: ${profile}`
      );
      return token;
    },
  },
});
