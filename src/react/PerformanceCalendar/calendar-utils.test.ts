import { describe, it, expect } from "vitest";
import raw from "../../../fixtures/tt-events.json";
import { toPerformances } from "../../adapters/tickettailor/transform";
import type { TicketTailorList, TicketTailorEvent } from "../../adapters/tickettailor/raw-types";
import { formatStatus, formatTime, getMonthFromArray, groupByDate } from "./calendar-utils";

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