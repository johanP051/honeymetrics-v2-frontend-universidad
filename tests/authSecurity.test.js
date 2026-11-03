import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createOfflineJwtToken,
  extractAuthAuthorization,
  getDefaultRoute,
  isTokenValid,
  parseJwtPayload,
  purgeAllAuthStorage,
} from '../src/context/authSecurity.js';
import { formatApiErrorDetail } from '../src/api/client.js';

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

const createToken = (payload) => {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encodedPayload}.signature`;
};

test('mock tokens are always rejected, including when loaded from storage', () => {
  assert.equal(isTokenValid('mock-token'), false);
});

test('malformed, missing-expiration, and expired JWTs are rejected', () => {
  const now = 1_800_000_000_000;
  assert.equal(isTokenValid('not-a-jwt', now), false);
  assert.equal(isTokenValid(`${encode({ alg: 'none' })}.${encode({ exp: now / 1000 + 60 })}.signature`, now), false);
  assert.equal(isTokenValid(`${encode({ alg: 'HS256' })}.${encode({ exp: now / 1000 + 60 })}.`, now), false);
  assert.equal(isTokenValid(createToken({ sub: 'user@example.test' }), now), false);
  assert.equal(isTokenValid(createToken({ exp: String(now / 1000 + 60) }), now), false);
  assert.equal(isTokenValid(createToken({ exp: now / 1000 - 1 }), now), false);
});

test('future-expiring JWTs are valid', () => {
  const now = 1_800_000_000_000;
  assert.equal(isTokenValid(createToken({ exp: now / 1000 + 60 }), now), true);
});

test('authorization is taken from API response or signed claims, never role_id', () => {
  assert.deepEqual(extractAuthAuthorization({ user: { role_id: 1 } }, { role_id: 1 }), {
    role: null,
    scopes: [],
  });
  assert.deepEqual(extractAuthAuthorization({ role: 'Administrador', scopes: ['admin:all'] }), {
    role: 'Administrador',
    scopes: ['admin:all'],
  });
});

test('offline JWT token passes isTokenValid and embeds role and scopes', () => {
  const token = createOfflineJwtToken({ sub: 'jsebastianposada@ucundinamarca.edu.co', role: 'Administrador' });
  assert.equal(isTokenValid(token), true);
  const payload = parseJwtPayload(token);
  assert.equal(payload.sub, 'jsebastianposada@ucundinamarca.edu.co');
  assert.equal(payload.role, 'Administrador');
  assert.equal(Array.isArray(payload.scopes) && payload.scopes.includes('admin:all'), true);
});

test('offline JWT tokens and mock-tokens are strictly rejected in production mode', () => {
  const originalEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';
    const token = createToken({ sub: 'admin@ucundinamarca.edu.co', exp: Date.now() / 1000 + 3600, mode: 'offline-mock' });
    assert.equal(isTokenValid(token), false);

    const offlineSigToken = `${token.split('.').slice(0, 2).join('.')}.hm_offline_sig`;
    assert.equal(isTokenValid(offlineSigToken), false);

    assert.equal(isTokenValid('mock-token'), false);
    assert.equal(isTokenValid('mock-token-admin'), false);

    assert.throws(() => {
      createOfflineJwtToken();
    }, /estrictamente prohibido en producción/);
  } finally {
    process.env.NODE_ENV = originalEnv;
  }
});

test('purgeAllAuthStorage cleans all auth tokens and metadata from storage', () => {
  const localStore = {
    access_token: 'secret1',
    user_data: '{"id":1}',
    hm_access_token: 'secret2',
    hm_user: '{"name":"Sebas"}',
    hm_role: 'Administrador',
    hm_scopes: '["admin:all"]',
    other_app_key: 'preserve',
  };
  const sessionStore = {
    hm_access_token: 'secret3',
    hm_user: '{"name":"Sebas"}',
    custom_key: 'keep_me',
  };

  globalThis.localStorage = {
    removeItem: (k) => { delete localStore[k]; },
    getItem: (k) => localStore[k] || null,
  };
  globalThis.sessionStorage = {
    removeItem: (k) => { delete sessionStore[k]; },
    getItem: (k) => sessionStore[k] || null,
  };

  purgeAllAuthStorage();

  assert.equal(localStore.access_token, undefined);
  assert.equal(localStore.user_data, undefined);
  assert.equal(localStore.hm_access_token, undefined);
  assert.equal(localStore.hm_user, undefined);
  assert.equal(localStore.hm_role, undefined);
  assert.equal(localStore.hm_scopes, undefined);
  assert.equal(localStore.other_app_key, 'preserve');

  assert.equal(sessionStore.hm_access_token, undefined);
  assert.equal(sessionStore.hm_user, undefined);
  assert.equal(sessionStore.custom_key, 'keep_me');
});

test('getDefaultRoute routes securely based on authentication and password flags', () => {
  assert.equal(getDefaultRoute({ isAuthenticated: false }), '/login');
  assert.equal(getDefaultRoute({ isAuthenticated: true, user: { must_change_password: true } }), '/settings?forcePassword=1');
  assert.equal(getDefaultRoute({ isAuthenticated: true, user: { must_change_password: false } }), '/dashboard');
});

test('formatApiErrorDetail normalizes pydantic 422 errors into friendly string', () => {
  const err422 = [{ loc: ['body', 'email'], msg: 'El dominio del correo no está autorizado', type: 'value_error' }];
  const formatted = formatApiErrorDetail(err422);
  assert.equal(formatted.includes('email: El dominio del correo no está autorizado'), true);
});

test('formatApiErrorDetail safely handles various error structures and strips Value error prefix', () => {
  // Multiple errors joined with bullet
  const multiErr = [
    { loc: ['body', 'username'], msg: 'Value error, usuario no registrado' },
    { loc: ['body', 'password'], msg: 'longitud mínima 12' },
  ];
  const resultMulti = formatApiErrorDetail(multiErr);
  assert.equal(resultMulti, 'username: usuario no registrado · password: longitud mínima 12');

  // Object with detail / message
  assert.equal(formatApiErrorDetail({ detail: 'Error específico' }), 'Error específico');
  assert.equal(formatApiErrorDetail({ message: 'Fallo de red' }), 'Fallo de red');

  // Simple string
  assert.equal(formatApiErrorDetail('Simple error message'), 'Simple error message');

  // Falsy or empty handling with fallback
  assert.equal(formatApiErrorDetail(null, 'Error por defecto'), 'Error por defecto');
  assert.equal(formatApiErrorDetail([], 'Fallback lista vacía'), 'Fallback lista vacía');
});
