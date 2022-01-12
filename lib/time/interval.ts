export default function createIntervaledTime(): Date {
  let date = new Date();
  date.setMilliseconds(0);
  date.setSeconds(0);

  if (date.getMinutes() >= 30) date.setMinutes(30);
  else date.setMinutes(0);

  return date;
}
