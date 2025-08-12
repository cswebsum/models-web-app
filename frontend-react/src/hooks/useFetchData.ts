import { useState, useEffect, useCallback } from 'react';

interface UseFetchDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: (newUrl?: string) => Promise<void>;
}

function useFetchData<T>(url: string): UseFetchDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>(url);

  const fetchData = useCallback(async (fetchUrl: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentUrl);
  }, [currentUrl, fetchData]);

  const refetch = async (newUrl?: string) => {
    if (newUrl) {
      setCurrentUrl(newUrl);
    } else {
      await fetchData(currentUrl); // Re-fetch current URL
    }
  };

  return { data, loading, error, refetch };
}

export default useFetchData;
