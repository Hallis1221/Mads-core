export const correctPassword = process.env.PASSWORD || "";

export function authenticated(password: string): boolean {
  return  password === correctPassword;
}