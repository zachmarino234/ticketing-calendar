import { describe, it, expect } from "vitest";
import raw from "../../../fixtures/tt-events.json";
import { getStatus, toPerformances } from "./transform";
import type { TicketTailorList, TicketTailorEvent } from "./raw-types";

const fixture = raw as TicketTailorList<TicketTailorEvent>;

function makeEvent(
  overrides: Partial<TicketTailorEvent> = {},
): TicketTailorEvent {
  return {
    ...fixture.data[1],
    ...overrides,
  };
}

function withTickets(quantity: number, total: number) {
  return makeEvent({
    ticket_types: [
      { ...fixture.data[1].ticket_types[0], quantity, quantity_total: total },
    ],
  });
}

describe("getStatus", () => {
  it("is available with plenty left", () => {
    expect(getStatus(withTickets(8, 10))).toBe("available");
  });

  it("is limited at 25% or less", () => {
    expect(getStatus(withTickets(2, 10))).toBe("limited");
  });

  it("is limited at exactly 25%", () => {
    expect(getStatus(withTickets(2, 10))).toBe("limited");
  });

  it("is sold_out at zero remaining", () => {
    expect(getStatus(withTickets(0, 10))).toBe("sold_out");
  });

  it("returns sold_out for events with no capacity", () => {
    expect(getStatus(withTickets(0, 0))).toBe("sold_out");
  });

  it("is off_sale when hidden, even with tickets left", () => {
    expect(getStatus(makeEvent({ hidden: "true" }))).toBe("off_sale");
  });

  it("is available when NOT hidden, even with tickets left", () => {
    expect(getStatus(makeEvent({ hidden: "false" }))).toBe("available");
  });

  it("treats unavailable events as off_sale", () => {
    expect(getStatus(makeEvent({ unavailable: "true" }))).toBe("off_sale");
  });
  
  it("treats private events as on sale, not off_sale", () => {
    expect(getStatus(makeEvent({ private: "true" }))).toBe("available");
  });

  it("calculates the remaining tickets across all ticket types", () => {
    const event = makeEvent({
      ticket_types: [
        { ...fixture.data[1].ticket_types[0], quantity: 1, quantity_total: 10 },
        { ...fixture.data[1].ticket_types[0], quantity: 2, quantity_total: 10 },
      ],
    });
    expect(event.ticket_types.reduce((sum, type) => sum + type.quantity, 0)).toBe(3);
    expect(event.ticket_types.reduce((sum, type) => sum + type.quantity_total, 0)).toBe(20);
    expect(getStatus(event)).toBe("limited");
  });
});

describe("toPerformances", () => {
  it("returns one performance per event", () => {
    const result = toPerformances(fixture);
    expect(result).toHaveLength(36);
  });

  it("sorts performances by start time", () => {
    const result = toPerformances(fixture);
    expect(result[0].startsAt).toBe("2026-11-20T19:30:00-05:00");
  });

  it("marks the sold-out date as sold_out", () => {
    const result = toPerformances(fixture);
    const nov20 = result.find((p) => p.startsAt.startsWith("2026-11-20"));
    expect(nov20?.status).toBe("sold_out");
  });
});
