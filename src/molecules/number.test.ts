import { strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import type { Iterator } from '../atoms/iterator.js';
import { readNumber, writeNumber } from './number.js';
import type { NumberSchema } from './schemas.js';

const dataView = new DataView(new ArrayBuffer(32));

const number = (
  input: number,
  expectedLength?: number,
  schema?: NumberSchema,
) => {
  // Write:
  const iterator: Iterator = [dataView, 0];
  writeNumber(iterator, input, schema);
  const writeLength = iterator[1];

  // Read:
  iterator[1] = 0;
  const output = readNumber(iterator, schema);
  const readLength = iterator[1];

  // Assertions:
  strictEqual(output, input);

  if (expectedLength !== undefined) {
    strictEqual(writeLength, expectedLength);
    strictEqual(readLength, expectedLength);
  }
};

describe('number', () => {
  describe('(type = "Decimal")', () => {
    test('negative values', () => {
      number(-1, 2);
      number(-123.456, 4);
      number(-3.141_592_653_589_793, 9);
      number(-9_007_199_254_740_991, 9);
      number(-9_007_199.254_740_991, 9);
    });

    test('non-negative values', () => {
      number(0, 2);
      number(1, 2);
      number(123.456, 4);
      number(3.141_592_653_589_793, 9);
      number(9_007_199_254_740_991, 9);
      number(9_007_199.254_740_991, 9);
    });
  });

  test('(type = "Float64")', () => {
    number(0, 8, { type: 'Float64' });
    number(1, 8, { type: 'Float64' });
    number(123.456, 8, { type: 'Float64' });
    number(3.141_592_653_589_793, 8, { type: 'Float64' });
    number(9_007_199_254_740_991, 8, { type: 'Float64' });
    number(9_007_199.254_740_991, 8, { type: 'Float64' });
  });

  test('(type = "Int")', () => {
    number(0, 1, { type: 'Int' });
    number(63, 1, { type: 'Int' });
    number(64, 2, { type: 'Int' });
    number(255, 2, { type: 'Int' });
    number(8191, 2, { type: 'Int' });
    number(8192, 3, { type: 'Int' });
    number(2_147_483_647, 5, { type: 'Int' });
    number(2_147_483_648, 5, { type: 'Int' });
    number(Number.MIN_SAFE_INTEGER, 8, { type: 'Int' });
    number(Number.MAX_SAFE_INTEGER, 8, { type: 'Int' });
  });

  test('(type = "Int8")', () => {
    number(0, 1, { type: 'Int8' });
    number(127, 1, { type: 'Int8' });
    number(-128, 1, { type: 'Int8' });
    throws(() => number(128, 2, { type: 'Int8' }));
    throws(() => number(-129, 2, { type: 'Int8' }));
  });

  test('(type = "Uint")', () => {
    number(0, 1, { type: 'Uint' });
    number(127, 1, { type: 'Uint' });
    number(128, 2, { type: 'Uint' });
    number(255, 2, { type: 'Uint' });
    number(16_383, 2, { type: 'Uint' });
    number(16_384, 3, { type: 'Uint' });
    number(2_147_483_647, 5, { type: 'Uint' });
    number(2_147_483_648, 5, { type: 'Uint' });
    number(Number.MAX_SAFE_INTEGER, 8, { type: 'Uint' });
  });

  test('(type = "Uint8")', () => {
    number(0, 1, { type: 'Uint8' });
    number(127, 1, { type: 'Uint8' });
    number(128, 1, { type: 'Uint8' });
    number(255, 1, { type: 'Uint8' });
    throws(() => number(16_383, 2, { type: 'Uint8' }));
  });
});
