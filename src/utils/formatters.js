export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
};

export const getThreatLevel = (score) => {
  if (score >= 90) return { label: 'Crítico', color: 'var(--accent-red)' };
  if (score >= 70) return { label: 'Alto', color: 'var(--accent-amber)' };
  return { label: 'Medio', color: 'var(--accent-blue)' };
};
