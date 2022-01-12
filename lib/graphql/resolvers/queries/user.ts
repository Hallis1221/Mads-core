import User from "../../../mongodb/models/user";

export async function checkAndDefaultUser(
  _: any,
  { email }: any,
  { req }: any
) {
  let user = await User.findOne({ email: email });
  if (!user?.creator || (user.creator !== false && user.creator != true))
    await User.findOneAndUpdate(
      { email: email },
      { creator: false },
      { new: true }
    );
  console.log(await User.findOne({ email: email }));
  return isCreator(_, { email }, { req });
}

export async function isCreator(_: any, { email }: any, { req }: any) {
  let user = await User.findOne({ email: email });
  if (user?.creator) return user.creator;

  return false;
}
