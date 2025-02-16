"use client";
import { format, isAfter, isBefore } from "date-fns";

export const formatDateRange = (startDate: string, endDate: string) => {
  return `${format(new Date(startDate), "dd MMM, yyyy")} to ${format(
    new Date(endDate),
    "dd MMM, yyyy"
  )}`;
};

export const isCouponValid = (startDate: string, endDate: string) => {
  const now = Date.now();
  return isAfter(now, new Date(startDate)) && isBefore(now, new Date(endDate));
};
export const formatTimeRange = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(startHour, startMinute, 0, 0); // Directly set hours and minutes

  const endDate = new Date();
  endDate.setHours(endHour, endMinute, 0, 0); // Directly set hours and minutes

  return `${format(startDate, "hh:mm a")} - ${format(endDate, "hh:mm a")}`;
};
