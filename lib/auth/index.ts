export const correctPassword = process.env.PASSWORD || "";

// The authentication function takes in a password as a string and returns a boolean. If the password is correct, it returns true. Otherwise, it returns false.
export function authenticated(password: string): boolean {
  // Return false if the correct password is not provided properly. For example, if the password is "", it returns false. This could happen if environment variables are not set properly.
  if (correctPassword === "") return false;
  // Return true if the password is correct.
  return  password === correctPassword;
}