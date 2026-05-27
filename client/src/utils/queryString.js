export function buildQueryString(filters = {}) {
  const cleaned = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );

  const query = new URLSearchParams(cleaned).toString();
  return query ? `?${query}` : '';
}
