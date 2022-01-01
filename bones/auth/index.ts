export const correctPassword = "h?LPhTi8ja8G!7Q@hGRsJx7444P6Sy?ob$ehS6mr";

export function authenticated(password: string): boolean {
  return ( process.env.NODE_ENV !== "production" && password === correctPassword) ;
}