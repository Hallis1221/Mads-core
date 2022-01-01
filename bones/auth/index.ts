export const correctPassword = process.env.PASSWORD;

export function authenticated(password: string): boolean {
  return process.env.NODE_ENV !== "production" || password === correctPassword;
}