import type { Performance } from "../../core/types";

export const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type MonthName = (typeof MONTHS)[number];

// Given a month number (1-12), return the corresponding month name from the MONTHS array.
export function getMonthFromArray(monthNumber: number): MonthName | undefined {
  return MONTHS[monthNumber - 1];
}

// Group performances by date (YYYY-MM-DD) for easier rendering in the calendar.
export function groupByDate(performances: Performance[]): Record<string, Performance[]> {
  const groups: Record<string, Performance[]> = {};
  for (const p of performances) {
    const date = p.startsAt.slice(0, 10); // "2026-11-21"
    if (!groups[date]) groups[date] = [];
    groups[date].push(p);
  }
  return groups;
}

// Format an ISO date string into a human-readable time string in the specified timezone.
export function formatTime(iso: string, timeZone: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
}

// Helper function to format availability status for display in the UI/for screen readers.
export function formatStatus(status: string): string {
  switch (status) {
    case "sold_out":
      return "sold out";
    case "off_sale":
      return "off sale";
  }
  return status;
}
