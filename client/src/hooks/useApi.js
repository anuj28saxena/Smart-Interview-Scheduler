import { useCallback, useEffect, useState } from 'react';

export function useApi(fetcher) {
  const [state, setState] = useState({ data: null, error: '', loading: Boolean(fetcher) });

  const load = useCallback(async (showLoading = true) => {
    if (!fetcher) return;
    if (showLoading) {
      setState((current) => ({ ...current, loading: true, error: '' }));
    }

    try {
      const data = await fetcher();
      setState({ data, error: '', loading: false });
    } catch (err) {
      setState({ data: null, error: err.message, loading: false });
    }
  }, [fetcher]);

  useEffect(() => {
    let ignore = false;
    if (!fetcher) return undefined;

    fetcher()
      .then((data) => {
        if (!ignore) setState({ data, error: '', loading: false });
      })
      .catch((err) => {
        if (!ignore) setState({ data: null, error: err.message, loading: false });
      });

    return () => {
      ignore = true;
    };
  }, [fetcher]);

  return { ...state, refresh: load };
}
