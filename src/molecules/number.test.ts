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
  describe('()', () => {
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

  test('(type = "float")', () => {
    number(0, 8, { type: 'float' });
    number(1, 8, { type: 'float' });
    number(123.456, 8, { type: 'float' });
    number(3.141_592_653_589_793, 8, { type: 'float' });
    number(9_007_199_254_740_991, 8, { type: 'float' });
    number(9_007_199.254_740_991, 8, { type: 'float' });
  });

  test('(type = "int")', () => {
    number(0, 1, { type: 'int' });
    number(63, 1, { type: 'int' });
    number(64, 2, { type: 'int' });
    number(255, 2, { type: 'int' });
    number(8191, 2, { type: 'int' });
    number(8192, 3, { type: 'int' });
    number(2_147_483_647, 5, { type: 'int' });
    number(2_147_483_648, 5, { type: 'int' });
    number(Number.MIN_SAFE_INTEGER, 8, { type: 'int' });
    number(Number.MAX_SAFE_INTEGER, 8, { type: 'int' });
  });

  test('(type = "int8")', () => {
    number(0, 1, { type: 'int8' });
    number(127, 1, { type: 'int8' });
    number(-128, 1, { type: 'int8' });
    throws(() => number(128, 2, { type: 'int8' }));
    throws(() => number(-129, 2, { type: 'int8' }));
  });

  test('(type = "uint")', () => {
    number(0, 1, { type: 'uint' });
    number(127, 1, { type: 'uint' });
    number(128, 2, { type: 'uint' });
    number(255, 2, { type: 'uint' });
    number(16_383, 2, { type: 'uint' });
    number(16_384, 3, { type: 'uint' });
    number(2_147_483_647, 5, { type: 'uint' });
    number(2_147_483_648, 5, { type: 'uint' });
    number(Number.MAX_SAFE_INTEGER, 8, { type: 'uint' });
  });

  test('(type = "uint8")', () => {
    number(0, 1, { type: 'uint8' });
    number(127, 1, { type: 'uint8' });
    number(128, 1, { type: 'uint8' });
    number(255, 1, { type: 'uint8' });
    throws(() => number(16_383, 2, { type: 'uint8' }));
  });
});
