import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  endOfDay,
  startOfDay,
  endOfISOWeek,
  startOfISOWeek,
  sub,
  add,
  isToday,
  isYesterday,
  differenceInHours,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  isValid
} from "date-fns";
import svDateLocale from "date-fns/locale/sv";
import enDateLocale from "date-fns/locale/en-US";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  let locale = svDateLocale;

  if (localStorage.getItem("antiloop_locale") === "en") {
    locale = enDateLocale;
  }

  let parsedDate;
  if (date instanceof Date) {
    parsedDate = date;
  } else {
    parsedDate = new Date(date);
  }

  return {
    dayDate: format(parsedDate, "iii dd", { locale }),
    dayShort: format(parsedDate, "iii", { locale }),
    dashSeparated: format(parsedDate, "yyyy-MM-dd", { locale }),
    dotSeparated: format(parsedDate, "dd.MM.yyyy", { locale }),
    dayName: format(parsedDate, "EEEE", { locale }),
    hourMinutes: format(parsedDate, "HH:mm", { locale }),
    monthDay: format(parsedDate, "MMM dd", { locale }),
    monthDayTime: format(parsedDate, "MMM dd, HH:mm", { locale })
  };
}

export function getStartOfWeek(date: Date) {
  return startOfISOWeek(date);
}

export function getEndOfWeek(date: Date) {
  return endOfISOWeek(date);
}

export function substractTime(
  date: Date,
  settings: {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
  }
) {
  return sub(date, settings);
}

export function addTime(
  date: Date,
  settings: {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
  }
) {
  return add(date, settings);
}

export function getEndOfDay(date: Date) {
  return endOfDay(date);
}

export function getStartOfDay(date: Date) {
  return startOfDay(date);
}

export function getDifferenceInHours(start: Date, end: Date) {
  return differenceInHours(start, end);
}

export function isDateToday(date: Date) {
  return isToday(date);
}

export function isDateYesterday(date: Date) {
  return isYesterday(date);
}

export function getDifferenceInCalendarDays(start: Date, end: Date) {
  return differenceInCalendarDays(start, end);
}

export function getDifferenceInMonths(start: Date, end: Date) {
  return differenceInCalendarMonths(start, end);
}

export function isExistingDate(date: string | Date) {
  return isValid(date);
}
