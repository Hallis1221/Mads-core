// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApolloServer } from "apollo-server-micro";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";

import resolvers from "../../bones/resolver";
import { typeDefs } from "../../bones/typedefs";
import { connectDB } from "../../utils/connection";
import { host, setHost } from "../../bones/network";

connectDB();

const apolloServer = new ApolloServer({
  typeDefs: typeDefs,
  resolvers,
  plugins: [
    // Install a landing page plugin based on NODE_ENV
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageGraphQLPlayground({
          workspaceName: "MADS api",
          settings: {
            "request.credentials": "include",
            "schema.polling.enable": true,
            "editor.theme": "dark",
          },
        })
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
});

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
  if (!host && req.headers.host) 
    setHost(req.headers.host.replace(/^https?:\/\//, "").replace(/^https?:\/\//, ""));
 
  
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