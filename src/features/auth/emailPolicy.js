export function isValidEmailFormat(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(normalized);
}

