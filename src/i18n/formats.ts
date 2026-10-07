import type { Formats } from "next-intl";

// Shared named formats: use them as format.dateTime(date, "long") instead of inline options.
export const formats = {
  dateTime: {
    day: { day: "numeric" },
    monthShort: { month: "short" },
    weekdayShort: { weekday: "short" },
    dayMonth: { day: "numeric", month: "short" },
    long: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
    medium: { day: "numeric", month: "long", year: "numeric" },
    time: { hour: "2-digit", minute: "2-digit", hourCycle: "h23" },
  },
  number: {
    integer: { maximumFractionDigits: 0 },
  },
} satisfies Formats;
