export const correctPassword = process.env.PASSWORD;

export function authenticated(password: string): boolean {
  console.log(password, correctPassword);
  return password == correctPassword;
}