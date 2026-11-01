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
  if (!token || token === 'mock-token') return false;
  const payload = parseJwtPayload(token);
  return Boolean(payload && Number.isFinite(payload.exp) && payload.exp * 1000 > now);
};

export const purgeAllAuthStorage = () => {
  const keys = [
    'access_token',
    'user_data',
    'hm_access_token',
    'hm_user',
    'hm_role',
    'hm_scopes',
  ];
  keys.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

export const ROLES_TO_SCOPES = {
  Administrador: [
    'dashboard:read', 'logs:read', 'logs:export', 'threats:read',
    'threats:write', 'threats:delete', 'ml:predict', 'ingest:write', 'admin:all',
  ],
  Superusuario: [
    'dashboard:read', 'logs:read', 'logs:export', 'threats:read',
    'threats:write', 'threats:delete', 'ml:predict', 'ingest:write', 'admin:all',
  ],
  Analista: ['dashboard:read', 'logs:read', 'logs:export', 'ml:predict'],
  'Analista de datos': ['dashboard:read', 'logs:read', 'logs:export', 'ml:predict'],
  Operador: ['dashboard:read', 'logs:read'],
  Guest: ['dashboard:read'],
  Consultor: ['dashboard:read', 'logs:read', 'logs:export', 'threats:read', 'threats:write'],
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
    String.fromCharCode(parseInt(p1, 16))
  );
  return btoa(utf8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const createOfflineJwtToken = ({
  sub = 'jsebastianposada@ucundinamarca.edu.co',
  role = 'Administrador',
  scopes = null,
  expiresInSeconds = 86400,
} = {}) => {
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
