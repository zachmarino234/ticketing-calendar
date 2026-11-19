// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePerformances } from "./usePerformances";
import { fetchEvents } from "../adapters/tickettailor/fetch";
import raw from "../../fixtures/tt-events.json";

vi.mock("../adapters/tickettailor/fetch");

beforeEach(() => vi.resetAllMocks());

describe("usePerformances", () => {
  it("starts in a loading state", async () => {
    vi.mocked(fetchEvents).mockResolvedValue(raw);
    const { result } = renderHook(() => usePerformances());
    expect(result.current.loading).toBe(true);
    expect(result.current.performances).toEqual([]);
  });

  it("returns transformed performances after loading", async () => {
    vi.mocked(fetchEvents).mockResolvedValue(raw);
    const { result } = renderHook(() => usePerformances());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.performances.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it("returns an error if fetchEvents fails", async () => {
    const errorMessage = "Network error";
    vi.mocked(fetchEvents).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => usePerformances());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe(errorMessage);
    expect(result.current.performances).toEqual([]);
  });
});
