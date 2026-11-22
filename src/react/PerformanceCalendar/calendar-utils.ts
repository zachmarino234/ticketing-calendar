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

export type CalendarCell =
  | { kind: "empty" }
  | { kind: "day"; day: number; dateKey: string; performances: Performance[] };

// Split an array of cells into weeks (arrays of 7 cells), padding with filler cells as needed.
export function toWeeks<T>(cells: T[], filler: T): T[][] {
  const padded = [...cells]
  while (padded.length % 7 !== 0) padded.push(filler)

  const weeks: T[][] = []
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7))
  }
  return weeks
}

// Filter out any shows that have already occured based on the current DateTime
export function upcomingOnly(performances: Performance[], now: Date = new Date()): Performance[] {
  return performances.filter((p) => new Date(p.startsAt) > now);
}

// Build a calendar grid for a given month and year, with each cell containing the day number and any performances on that day.
export function buildCalendar(year: number, month: number, performances: Performance[]): CalendarCell[][] {
  // 1. calculate the first weekday and the number of days in the month
  const firstDayIndex = new Date(year, month - 1, 1).getDay(); // month - 1: JS months are 0-based
  const daysInMonth = new Date(year, month, 0).getDate(); // day 0 of next month = last day of this one
  // 2. create an array of empty slots for the days before the first of the month, and an array of the days in the month. Combine them to create the full calendar grid.
  const emptySlots: CalendarCell[] = Array.from({ length: firstDayIndex }, () => ({ kind: "empty" }));
  const dayCells: CalendarCell[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    // 3. group performances by date and attach them to the corresponding day cells
    const byDate = groupByDate(performances);
    return {
      kind: "day",
      day,
      dateKey,
      performances: byDate[dateKey] ?? [],
    };
  });
  // 4. combine the empty slots and day cells, then split into weeks
  const cells = [...emptySlots, ...dayCells];
  return toWeeks(cells, { kind: "empty" });
}

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
