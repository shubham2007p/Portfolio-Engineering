import { useState, useEffect } from 'react';

/**
 * useApi — fetches data from a backend endpoint with loading / error states.
 *
 * @param {string} url         - API endpoint path (e.g. '/api/github/activity')
 * @param {object} [options]   - fetch options (method, body, headers …)
 * @param {any}    [fallback]  - value to use while loading or on error
 *
 * Usage:
 *   const { data, loading, error } = useApi('/api/projects', {}, []);
 */
export function useApi(url, options = {}, fallback = null) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn(`[useApi] ${url}:`, err.message);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}

/**
 * postApi — one-shot POST helper (not a hook; call inside handlers).
 *
 * @param {string} url    - API endpoint path
 * @param {object} body   - JSON body to send
 * @returns {Promise<{ok: boolean, data?: any, error?: string}>}
 */
export async function postApi(url, body) {
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) return { ok: false, error: data.error || 'Request failed' };
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
