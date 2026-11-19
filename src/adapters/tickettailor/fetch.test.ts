import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchEvents } from "./fetch";

afterEach(() => vi.unstubAllGlobals())

describe('fetchEvents', () => {
  it('calls the events endpoint and returns the JSON', async () => {
    const fakeFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [], links: { next: null, previous: null } })),
    )
    vi.stubGlobal('fetch', fakeFetch)

    const result = await fetchEvents()

    expect(fakeFetch).toHaveBeenCalledWith('/api/tt/events')
    expect(result.data).toEqual([])
  })

  it('throws when the API returns an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('nope', { status: 401 })))
    await expect(fetchEvents()).rejects.toThrow('401')
  })
})