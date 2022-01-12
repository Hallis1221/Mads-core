export default function createIntervaledTime(
  pair?: boolean
): Date | { begins: Date; ends: Date } {
  let date = new Date();
  date.setMilliseconds(0);
  date.setSeconds(0);

  if (date.getMinutes() >= 30) date.setMinutes(30);
  else date.setMinutes(0);

  // If pair is true, we want to return a pair of times, both the time decided by the function and the time that is 30 minutes after it.
  if (pair)
    return {
      begins: new Date(date.getTime() + 30 * 60000),
      ends: date,
    };

  return date;
}
