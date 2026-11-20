import { describe, it, expect } from "vitest";
import raw from "../../../fixtures/tt-events.json";
import { toPerformances } from "../../adapters/tickettailor/transform";
import type { TicketTailorList, TicketTailorEvent } from "../../adapters/tickettailor/raw-types";
import { buildCalendar, formatStatus, formatTime, getMonthFromArray, groupByDate, toWeeks } from "./calendar-utils";

const fixture = raw as TicketTailorList<TicketTailorEvent>;

describe("getMonthFromArray", () => {
  it("should return December for month number 12", () => {
    expect(getMonthFromArray(12)).toBe("December");
  });

  it("should return January for month number 1", () => {
    expect(getMonthFromArray(1)).toBe("January");
  });

  it("should return May for month number 5", () => {
    expect(getMonthFromArray(5)).toBe("May");
  });

  it("should return undefined for month number 0", () => {
    expect(getMonthFromArray(0)).toBeUndefined();
  });

  it("should return undefined for month number 13", () => {
    expect(getMonthFromArray(13)).toBeUndefined();
  });

  it("should return undefined for negative month number", () => {
    expect(getMonthFromArray(-1)).toBeUndefined();
  });

  it("should return undefined for non-integer month number", () => {
    expect(getMonthFromArray(5.5)).toBeUndefined();
  });
});

describe("groupByDate", () => {
  it("should group performances by date", () => {
    const performances = toPerformances(fixture);
    const grouped = groupByDate(performances);

    // Check that the keys are valid dates and that each performance is in the correct group
    for (const date in grouped) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
      for (const performance of grouped[date]) {
        expect(performance.startsAt.startsWith(date)).toBe(true);
      }
    }
  });

  it("should return an empty object for an empty array", () => {
    const grouped = groupByDate([]);
    expect(grouped).toEqual({});
  });
});

describe("formatTime", () => {
  it("should format a time in 24-hour format", () => {
    expect(formatTime("2026-11-21T19:00:00Z", "America/New_York")).toBe("2:00 PM");
  });

  it("should format a time with a non EST timezone", () => {
    expect(formatTime("2026-11-21T19:00:00Z", "Europe/London")).toBe("7:00 PM");
  });
});

describe("formatStatus", () => {
  it("should format 'sold_out' to 'sold out'", () => {
    expect(formatStatus("sold_out")).toBe("sold out");
  });

  it("should format 'off_sale' to 'off sale'", () => {
    expect(formatStatus("off_sale")).toBe("off sale");
  });

  it("should return the same string for other statuses", () => {
    expect(formatStatus("available")).toBe("available");
    expect(formatStatus("limited")).toBe("limited");
  });
});

describe("toWeeks", () => {
  it("should split an array of 14 elements into 2 weeks", () => {
    const input = Array.from({ length: 14 }, (_, i) => i + 1);
    const result = toWeeks(input, 0);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(result[1]).toEqual([8, 9, 10, 11, 12, 13, 14]);
  });

  it("should pad the last week with filler if not enough elements", () => {
    const input = Array.from({ length: 10 }, (_, i) => i + 1);
    const result = toWeeks(input, 0);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(result[1]).toEqual([8, 9, 10, 0, 0, 0, 0]);
  });

  it("should pad the first week with filler if the first day is not Sunday", () => {
    const input = Array.from({ length: 10 }, (_, i) => i + 1);
    const result = toWeeks([null, null, ...input], 0);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual([null, null, 1, 2, 3, 4, 5]);
    expect(result[1]).toEqual([6, 7, 8, 9, 10, 0, 0]);
  });

  it("should return an empty array for an empty input", () => {
    const result = toWeeks([], 0);
    expect(result).toEqual([]);
  });

  it("should handle an input that is already a multiple of 7", () => {
    const input = Array.from({ length: 21 }, (_, i) => i + 1);
    const result = toWeeks(input, 0);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(result[1]).toEqual([8, 9, 10, 11, 12, 13, 14]);
    expect(result[2]).toEqual([15, 16, 17, 18, 19, 20, 21]);
  });
});

describe("buildCalendar", () => {
  it("should build a calendar for November 2026 with performances", () => {
    const performances = toPerformances(fixture);
    const calendar = buildCalendar(2026, 11, performances);

    // Check that the calendar has the correct number of weeks (5 for November 2026)
    expect(calendar).toHaveLength(5);

    // Check that the first week has the correct number of empty cells (Sunday is the 1st)
    expect(calendar[0].filter(cell => cell.kind === "empty")).toHaveLength(0);

    // Check that the last week has the correct number of empty cells (November has 30 days)
    expect(calendar[4].filter(cell => cell.kind === "empty")).toHaveLength(5);

    // Check that performances are correctly assigned to their respective days
    const groupedPerformances = groupByDate(performances);
    for (const week of calendar) {
      for (const cell of week) {
        if (cell.kind === "day") {
          const dateKey = cell.dateKey;
          expect(cell.performances).toEqual(groupedPerformances[dateKey] || []);
        }
      }
    }
  });
});