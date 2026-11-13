export const parseJwtPayload = (token) => {
  try {
    const segments = token.split('.');
    if (segments.length !== 3 || segments.some((segment) => !segment)) return null;
    const decodeSegment = (segment) => {
      const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join('')
      );
      return JSON.parse(json);
    };
    const header = decodeSegment(segments[0]);
    const payload = decodeSegment(segments[1]);
    if (!header || typeof header !== 'object' || typeof header.alg !== 'string' || header.alg === 'none') {
      return null;
    }
    return payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : null;
  } catch {
    return null;
  }
};

export const isTokenValid = (token, now = Date.now()) => {
  if (!token || typeof token !== 'string') return false;
  if (token === 'mock-token' || token.startsWith('mock-token')) return false;

  const isProd =
    (typeof import.meta !== 'undefined' && Boolean(import.meta?.env?.PROD)) ||
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production');

  if (token.includes('.hm_offline_sig') && isProd) return false;

  const payload = parseJwtPayload(token);
  if (!payload) return false;
  if (payload.mode === 'offline-mock' && isProd) return false;

  return Boolean(Number.isFinite(payload.exp) && payload.exp * 1000 > now);
};

export const purgeAllAuthStorage = () => {
  const keys = [
    'access_token',
    'user_data',
    'hm_access_token',
    'hm_user',
    'hm_role',
    'hm_scopes',
    'hm_reset_token',
  ];
  if (typeof localStorage !== 'undefined') {
    try {
      keys.forEach((k) => localStorage.removeItem(k));
      localStorage.clear();
    } catch {}
  }
  if (typeof sessionStorage !== 'undefined') {
    try {
      keys.forEach((k) => sessionStorage.removeItem(k));
      sessionStorage.clear();
    } catch {}
  }
};

export const ROLES_TO_SCOPES = {
  Administrador: [
    'dashboard:read', 'logs:read', 'logs:export', 'threats:read',
    'threats:write', 'threats:delete', 'blacklist:read', 'blacklist:write',
    'users:profile', 'admin:users', 'admin:audit', 'admin:all',
  ],
  Superusuario: [
    'dashboard:read', 'logs:read', 'logs:export', 'threats:read',
    'threats:write', 'threats:delete', 'blacklist:read', 'blacklist:write',
    'users:profile', 'admin:users', 'admin:audit', 'admin:all',
  ],
  Consultor: [
    'dashboard:read', 'threats:read', 'threats:write', 'threats:delete',
    'blacklist:read', 'blacklist:write', 'users:profile',
  ],
  'Consultor de Ciberseguridad': [
    'dashboard:read', 'threats:read', 'threats:write', 'threats:delete',
    'blacklist:read', 'blacklist:write', 'users:profile',
  ],
  Analista: ['dashboard:read', 'logs:read', 'logs:export', 'users:profile'],
  'Analista de datos': ['dashboard:read', 'logs:read', 'logs:export', 'users:profile'],
  Directivo: ['dashboard:read', 'threats:read', 'blacklist:read', 'users:profile'],
  'Directivo de T.I.': ['dashboard:read', 'threats:read', 'blacklist:read', 'users:profile'],
  'Directivo de TI': ['dashboard:read', 'threats:read', 'blacklist:read', 'users:profile'],
};

const USER_TEXT_FIELDS = {
  email: 254,
  first_names: 150,
  last_names: 150,
  created_at: 64,
  updated_at: 64,
};
const USER_BOOLEAN_FIELDS = ['is_active', 'must_change_password', 'is_mfa_enabled', 'mfa_enabled'];
const USER_NUMBER_FIELDS = ['id', 'role_id'];
const ALL_SCOPES = new Set(Object.values(ROLES_TO_SCOPES).flat());

const isSafeText = (value, maxLength) =>
  typeof value === 'string' &&
  value.length <= maxLength &&
  !/[\u0000-\u001f\u007f]/.test(value);

export const sanitizeRole = (role) =>
  typeof role === 'string' && Object.prototype.hasOwnProperty.call(ROLES_TO_SCOPES, role)
    ? role
    : null;

export const sanitizeScopes = (scopes) => {
  if (!Array.isArray(scopes)) return [];
  return scopes.filter((scope) => isSafeText(scope, 100) && ALL_SCOPES.has(scope));
};

export const sanitizeUserProfile = (profile) => {
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) return null;

  const sanitized = {};
  Object.entries(USER_TEXT_FIELDS).forEach(([field, maxLength]) => {
    if (isSafeText(profile[field], maxLength)) sanitized[field] = profile[field];
  });
  const role = sanitizeRole(profile.role_name);
  if (role) sanitized.role_name = role;
  USER_BOOLEAN_FIELDS.forEach((field) => {
    if (typeof profile[field] === 'boolean') sanitized[field] = profile[field];
  });
  USER_NUMBER_FIELDS.forEach((field) => {
    if (Number.isSafeInteger(profile[field]) && profile[field] >= 0) sanitized[field] = profile[field];
  });
  if (Array.isArray(profile.scopes)) sanitized.scopes = sanitizeScopes(profile.scopes);

  return sanitized;
};

export const getScopesForRole = (roleName = 'Analista') => {
  if (!roleName) return ['dashboard:read'];
  if (ROLES_TO_SCOPES[roleName]) return [...ROLES_TO_SCOPES[roleName]];
  const normalized = String(roleName || '').trim().toLowerCase();
  for (const [key, scopes] of Object.entries(ROLES_TO_SCOPES)) {
    if (key.trim().toLowerCase() === normalized) return [...scopes];
  }
  return ['dashboard:read'];
};

export const extractAuthAuthorization = (data = {}, decoded = null) => ({
  role: data.role || data.user?.role_name || data.user?.role || decoded?.role || decoded?.role_name || null,
  scopes: Array.isArray(data.scopes)
    ? data.scopes
    : (Array.isArray(decoded?.scopes) ? decoded.scopes : []),
});

const encodeBase64Url = (obj) => {
  const json = JSON.stringify(obj);
  const utf8 = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(Number.parseInt(p1, 16))
  );
  return btoa(utf8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

};

export const createOfflineJwtToken = ({
  sub = 'jsebastianposada@ucundinamarca.edu.co',
  role = 'Administrador',
  scopes = null,
  expiresInSeconds = 86400,
} = {}) => {
  const isProd =
    (typeof import.meta !== 'undefined' && Boolean(import.meta?.env?.PROD)) ||
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production');
  if (isProd) {
    throw new Error('createOfflineJwtToken está estrictamente prohibido en producción');
  }
  const nowSec = Math.floor(Date.now() / 1000);
  const resolvedScopes = Array.isArray(scopes) ? scopes : getScopesForRole(role);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub,
    role,
    role_name: role,
    scopes: resolvedScopes,
    iat: nowSec,
    exp: nowSec + expiresInSeconds,
    mode: 'offline-mock',
  };
  return `${encodeBase64Url(header)}.${encodeBase64Url(payload)}.hm_offline_sig`;
};

export const getDefaultRoute = ({ isAuthenticated = false, user = null } = {}) => {
  if (!isAuthenticated) return '/login';
  if (user?.must_change_password) return '/settings?forcePassword=1';
  return '/dashboard';
};
