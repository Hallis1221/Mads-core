import { GraphQLClient } from "graphql-request";

export const correctPassword = "h?LPhTi8ja8G!7Q@hGRsJx7444P6Sy?ob$ehS6mr";
export var host: string | undefined;
export var client = new GraphQLClient(`${host}/api/graphql`);


export function authenticated(password: string): boolean {
  return ( process.env.NODE_ENV !== "production" && password === correctPassword) ;
}

export function setHost(newHost: string): void {
  host = newHost;
  client = new GraphQLClient(`${host}/api/graphql`);
}