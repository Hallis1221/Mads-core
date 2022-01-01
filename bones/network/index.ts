import { GraphQLClient } from "graphql-request";
import { correctPassword } from "../auth";

export var host: string | undefined;
export var client = new GraphQLClient(`${host}/api/graphql`);

export function authenticated(password: string): boolean {
  return process.env.NODE_ENV !== "production" || password === correctPassword;
}

export function setHost(newHost: string): void {
  if (newHost.includes("localhost")) host = `http://${newHost}`;
  else host = "https://" + newHost;
  client = new GraphQLClient(`${host}/api/graphql`);

  console.log(`Set host to ${host}`);
}
