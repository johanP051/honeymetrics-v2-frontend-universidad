import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePasswordStrength } from '../src/utils/passwordStrength.js';

test('empty or falsy password returns score 0 and transparent background', () => {
  assert.deepEqual(calculatePasswordStrength(''), { score: 0, label: '', color: 'bg-transparent' });
  assert.deepEqual(calculatePasswordStrength(null), { score: 0, label: '', color: 'bg-transparent' });
  assert.deepEqual(calculatePasswordStrength(undefined), { score: 0, label: '', color: 'bg-transparent' });
});

test('password under 12 characters is classified as Débil with score 25', () => {
  const shortPass = calculatePasswordStrength('Short1!Aa');
  assert.equal(shortPass.score, 25);
  assert.equal(shortPass.label, 'Débil (< 12 caracteres)');
  assert.equal(shortPass.color, 'bg-hm-danger');
});

test('password >= 12 chars with limited character variety scores Aceptable (50)', () => {
  // 12 lowercase chars: score = 1 (base) + 1 (lowercase) = 2 <= 3 -> score 50
  const pass = calculatePasswordStrength('abcdefghijklmno');
  assert.equal(pass.score, 50);
  assert.equal(pass.label, 'Aceptable');
  assert.equal(pass.color, 'bg-yellow-500');
});

test('password >= 12 chars with upper, lower, numbers scores Buena (75)', () => {
  // 12 chars with upper, lower, digit: base 1 + upper 1 + lower 1 + digit 1 = 4 <= 4 -> score 75
  const pass = calculatePasswordStrength('Abcdefghijk1');
  assert.equal(pass.score, 75);
  assert.equal(pass.label, 'Buena');
  assert.equal(pass.color, 'bg-emerald-500');
});

test('password >= 16 chars with full complexity scores Muy Fuerte (100)', () => {
  // >= 16 + upper + lower + digit + special: base 1 + len 1 + upper 1 + lower 1 + digit 1 + special 1 = 6 -> score 100
  const pass = calculatePasswordStrength('SuperSecurePass123!@#');
  assert.equal(pass.score, 100);
  assert.equal(pass.label, 'Muy Fuerte');
  assert.equal(pass.color, 'bg-hm-success');
});
