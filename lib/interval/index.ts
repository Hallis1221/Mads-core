import { intervalTimes } from "../config/time";

// function for creating intervaled time. Returns a Date object
export function createIntervalDate(): Date {
  // Create a new Date object with the current time
  let date: Date = new Date(Date.now());
  // Set the milliseconds to 0
  date.setMilliseconds(0);
  // Set the seconds to 0
  date.setSeconds(0);

  // If the current minutes is less than the interval minutes,
  // then set the minutes to the interval minutes
  // Else, set the minutes to zero as we have not reached the interval minutes threshold
  // If interval minutes is undefined, do not set minutes

  if (intervalTimes.minutes !== undefined) {
    if (date.getMinutes() >= intervalTimes.minutes)
      date.setMinutes(intervalTimes.minutes);
    else date.setMinutes(0);
  }

  // If the current hours is less than the interval hours,
  // then set the hours to the interval hours
  // Else, set the hours to zero as we have not reached the interval hours threshold
  // If interval hours is undefined, do not set hours

  if (intervalTimes.hours !== undefined) {
    if (date.getHours() >= intervalTimes.hours)
      date.setHours(intervalTimes.hours);
    else date.setHours(0);
  }

  // If the current days is less than the interval days,
  // then set the days to the interval days
  // Else, set the days to zero as we have not reached the interval days threshold
  // If interval days is undefined, do not set days

  if (intervalTimes.days !== undefined) {
    if (date.getDate() >= intervalTimes.days) date.setDate(intervalTimes.days);
    else date.setDate(0);
  }

  // Return the date object
  return date;
}

// Function for creating a new intervaled time. Returns a Date object with a begins date at the current time and an end date at the interval time
// Function for creating a intervaled time pair. A pair of begins and ends.
export function createIntervalTimePair(): {
  begins: Date;
  ends: Date;
} {
  let beginsDate = createIntervalDate();
  let endsDate = new Date(beginsDate.getTime() + 30 * 60000);

  return {
    begins: beginsDate,
    ends: endsDate,
  };
}
