import { GraphQLClient } from "graphql-request";

export var host: string | undefined;
export var client = new GraphQLClient(`${host}/api/graphql`);


export function setHost(newHost: string): void {
  if (newHost.includes("localhost")) host = `http://${newHost}`;
  else host = "https://" + newHost;
  client = new GraphQLClient(`${host}/api/graphql`, {
  keepalive: true,
  });

  console.log(`Set host to ${host}`);
}
