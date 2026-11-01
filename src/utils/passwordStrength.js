export const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: 'bg-transparent' };
  if (password.length < 12) {
    return { score: 25, label: 'Débil (< 12 caracteres)', color: 'bg-hm-danger' };
  }

  let score = 1;
  if (password.length >= 16) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 3) return { score: 50, label: 'Aceptable', color: 'bg-yellow-500' };
  if (score <= 4) return { score: 75, label: 'Buena', color: 'bg-emerald-500' };
  return { score: 100, label: 'Muy Fuerte', color: 'bg-hm-success' };
};
