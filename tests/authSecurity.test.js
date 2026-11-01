import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createOfflineJwtToken,
  extractAuthAuthorization,
  getDefaultRoute,
  isTokenValid,
  parseJwtPayload,
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

test('formatApiErrorDetail normalizes pydantic 422 errors into friendly string', () => {
  const err422 = [{ loc: ['body', 'email'], msg: 'El dominio del correo no está autorizado', type: 'value_error' }];
  const formatted = formatApiErrorDetail(err422);
  assert.equal(formatted.includes('email: El dominio del correo no está autorizado'), true);
});
