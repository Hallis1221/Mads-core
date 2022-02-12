// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApolloServer } from "apollo-server-micro";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";

import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "../../lib/db/connect/mongoose/connect";
import typeDefinitions from "../../lib/config/api/gql/typedefs";
import resolvers from "../../lib/api/gql/resolvers";
import { logger } from "../../lib/log";
import requestIp from "request-ip";

connectDB();
const ApiProductionLanding = ApolloServerPluginLandingPageGraphQLPlayground({
  workspaceName: "MADS api",
  settings: {
    "request.credentials": "include",
    "schema.polling.enable": true,
    "editor.theme": "dark",
  },
});
const ApiLocalLanding = ApolloServerPluginLandingPageLocalDefault({
  footer: false,
});

const apolloServer = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers,
  plugins: [
    // Install a landing page plugin based on NODE_ENV
    process.env.NODE_ENV === "production"
      ? ApiProductionLanding
      : ApiLocalLanding,
  ],
});

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const allowedOrigins = [
    "https://studio.apollographql.com",
    "http://localhost:3000",
    "https://www.marketads.me",
    "https://creator.marketads.me",
  ];
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin))
    res.setHeader("Access-Control-Allow-Origin", origin);
  // Ensure we always allow CORS requests from the frontend
  else res.setHeader("Access-Control-Allow-Origin", "https://www.marketads.me");

  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  let user = await getSession({ req });

  if (user) {
    logger.debug("Passing user to apollo server: ", user);
    apolloServer.requestOptions.context = {
      req,
      res,
      user,
      ip: requestIp.getClientIp(req),
    };
  } else
    apolloServer.requestOptions.context = {
      req,
      res,
      user,
      ip: requestIp.getClientIp(req),
    };

  // To use the user object in a resolver, see this example:
  /*
    export default async function UseUser(_: any, {input}: any, {user}: any) {
      console.log(user);
    }
  */

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
