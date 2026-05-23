import { useCallback, useState } from 'react';
import { apiClient } from '../services/apiClient.js';

export function useApi() {
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (path, options) => {
    setLoading(true);
    try {
      return await apiClient(path, options);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, request };
}
