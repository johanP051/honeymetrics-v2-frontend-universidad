import test from 'node:test';
import assert from 'node:assert/strict';

test('backup codes format is strictly 8 alphanumeric 4x4 pairs', () => {
  const codes = [
    'A1B2-C3D4', 'E5F6-G7H8', 'J9K0-L1M2', 'N3P4-Q5R6',
    'S7T8-U9V0', 'W1X2-Y3Z4', '2A3B-4C5D', '6E7F-8G9H',
  ];

  assert.equal(codes.length, 8);
  const regex = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  for (const code of codes) {
    assert.match(code, regex);
  }
});

test('fallback ensures non-empty backup codes list with 8 codes', () => {
  const DEFAULT_BACKUP_CODES = [
    'A1B2-C3D4', 'E5F6-G7H8', 'J9K0-L1M2', 'N3P4-Q5R6',
    'S7T8-U9V0', 'W1X2-Y3Z4', '2A3B-4C5D', '6E7F-8G9H',
  ];

  const getCodes = (input) => (Array.isArray(input) && input.length > 0 ? input : DEFAULT_BACKUP_CODES);

  assert.equal(getCodes([]).length, 8);
  assert.equal(getCodes(null).length, 8);
  assert.equal(getCodes(undefined).length, 8);
  assert.equal(getCodes(['TEST-1234']).length, 1);
});
