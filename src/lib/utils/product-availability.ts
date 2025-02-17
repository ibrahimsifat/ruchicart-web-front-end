import { addDays, isWithinInterval, set } from "date-fns";

export function isProductAvailable(
  availableTimeStarts: string,
  availableTimeEnds: string
): boolean {
  const now = new Date();

  // Create today's date with the available time
  const todayStart = set(now, {
    hours: parseInt(availableTimeStarts.split(":")[0]),
    minutes: parseInt(availableTimeStarts.split(":")[1]),
    seconds: parseInt(availableTimeStarts.split(":")[2]),
    milliseconds: 0,
  });

  const todayEnd = set(now, {
    hours: parseInt(availableTimeEnds.split(":")[0]),
    minutes: parseInt(availableTimeEnds.split(":")[1]),
    seconds: parseInt(availableTimeEnds.split(":")[2]),
    milliseconds: 0,
  });

  // If end time is before start time (spans midnight)
  if (todayEnd < todayStart) {
    // Add a day to end time
    const adjustedEnd = addDays(todayEnd, 1);
    return isWithinInterval(now, { start: todayStart, end: adjustedEnd });
  }

  return isWithinInterval(now, { start: todayStart, end: todayEnd });
}

export function getNextAvailableTime(
  availableTimeStarts: string,
  availableTimeEnds: string
): Date {
  const now = new Date();

  // Create today's start time
  const todayStart = set(now, {
    hours: parseInt(availableTimeStarts.split(":")[0]),
    minutes: parseInt(availableTimeStarts.split(":")[1]),
    seconds: parseInt(availableTimeStarts.split(":")[2]),
    milliseconds: 0,
  });

  // Create today's end time
  const todayEnd = set(now, {
    hours: parseInt(availableTimeEnds.split(":")[0]),
    minutes: parseInt(availableTimeEnds.split(":")[1]),
    seconds: parseInt(availableTimeEnds.split(":")[2]),
    milliseconds: 0,
  });

  // If current time is before today's start time, return today's start time
  if (now < todayStart) {
    return todayStart;
  }

  // If end time is before start time (spans midnight)
  if (todayEnd < todayStart) {
    // If we're in the valid interval (between start and midnight + end)
    const adjustedEnd = addDays(todayEnd, 1);
    if (isWithinInterval(now, { start: todayStart, end: adjustedEnd })) {
      return now;
    }

    // If we're past the end time, return next day's start
    if (now > adjustedEnd) {
      return addDays(todayStart, 1);
    }

    // If we're before the start time, return today's start
    return todayStart;
  }

  // Regular case (start and end on same day)
  // If we're past today's end time, return tomorrow's start time
  if (now > todayEnd) {
    return addDays(todayStart, 1);
  }

  // If we're before start time, return today's start time
  return todayStart;
}
