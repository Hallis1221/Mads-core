// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApolloServer } from "apollo-server-micro";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";

import resolvers from "../../../bones/resolvers/ads";
import { typeDefs } from "../../../bones/typedefs/ads";
import { connectDB } from "../../../utils/connection";

connectDB();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    // Install a landing page plugin based on NODE_ENV
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault({
          graphRef: "my-graph-id@my-graph-variant",
          footer: false,
        })
      : ApolloServerPluginLandingPageGraphQLPlayground({
          workspaceName: "MADS api",
          settings: {
            "request.credentials": "include",
            "schema.polling.enable": true,
            "editor.theme": "dark",
          },
        }),
  ],
});

const startServer = apolloServer.start();

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api/ads/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
