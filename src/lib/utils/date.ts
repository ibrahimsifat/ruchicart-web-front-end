import { format, isAfter, isBefore } from "date-fns";

export const formatDateRange = (startDate: string, endDate: string) => {
  return `${format(new Date(startDate), "dd MMM, yyyy")} to ${format(
    new Date(endDate),
    "dd MMM, yyyy"
  )}`;
};

export const isCouponValid = (startDate: string, endDate: string) => {
  const now = new Date();
  return isAfter(now, new Date(startDate)) && isBefore(now, new Date(endDate));
};
