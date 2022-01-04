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
const allowedOrigins = ["https://studio.apollographql.com", "http://localhost:3000", "https://www.marketads.me"];
const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) 
    res.setHeader("Access-Control-Allow-Origin", origin);

    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST',);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', "true");

  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
 
  
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
