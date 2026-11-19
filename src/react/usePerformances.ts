import { useEffect, useState } from "react";
import type { Performance } from "../core/types";
import { fetchEvents } from "../adapters/tickettailor/fetch";
import { toPerformances } from "../adapters/tickettailor/transform";

export function usePerformances() {
  // three pieces of state: performances (start []), loading (start true), error (start null)
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false; // see note below

    // 1. call fetchEvents()
    const fetchData = async () => {
      try {
        const raw = await fetchEvents();
        const performances = toPerformances(raw);
        if (!ignore) {
          setPerformances(performances);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, []);

  return { performances, loading, error };
}
