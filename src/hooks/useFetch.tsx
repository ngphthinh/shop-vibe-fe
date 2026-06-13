import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFetch<T>(
  fetchFunction: () => Promise<T>,
  // Dùng stable reference thay vì truyền deps thô
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Giữ reference mới nhất của fetchFunction mà không trigger re-fetch
  const fetchFnRef = useRef(fetchFunction);
  useEffect(() => {
    fetchFnRef.current = fetchFunction;
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFnRef.current();
      setData(result);
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Lỗi khi tải dữ liệu");
      setError(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // deps rỗng — stable callback, không cần eslint-disable

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
