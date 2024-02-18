import { strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import type { Iterator } from '../atoms/iterator.js';
import { readNumber, writeNumber } from './number.js';
import type { NumberSchema } from './schemas.js';

const dataView = new DataView(new ArrayBuffer(32));

const number = (
  input: number,
  schema: NumberSchema,
  expectedLength?: number,
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
      number(-1, {}, 2);
      number(-123.456, {}, 4);
      number(-3.141_592_653_589_793, {}, 9);
      number(-9_007_199_254_740_991, {}, 9);
      number(-9_007_199.254_740_991, {}, 9);
    });

    test('non-negative values', () => {
      number(0, {}, 2);
      number(1, {}, 2);
      number(123.456, {}, 4);
      number(3.141_592_653_589_793, {}, 9);
      number(9_007_199_254_740_991, {}, 9);
      number(9_007_199.254_740_991, {}, 9);
    });
  });

  test('(type = "float")', () => {
    number(0, { type: 'float' }, 8);
    number(1, { type: 'float' }, 8);
    number(123.456, { type: 'float' }, 8);
    number(3.141_592_653_589_793, { type: 'float' }, 8);
    number(9_007_199_254_740_991, { type: 'float' }, 8);
    number(9_007_199.254_740_991, { type: 'float' }, 8);
  });

  test('(type = "int")', () => {
    number(0, { type: 'int' }, 1);
    number(63, { type: 'int' }, 1);
    number(64, { type: 'int' }, 2);
    number(255, { type: 'int' }, 2);
    number(8191, { type: 'int' }, 2);
    number(8192, { type: 'int' }, 3);
    number(2_147_483_647, { type: 'int' }, 5);
    number(2_147_483_648, { type: 'int' }, 5);
    number(Number.MIN_SAFE_INTEGER, { type: 'int' }, 8);
    number(Number.MAX_SAFE_INTEGER, { type: 'int' }, 8);
  });

  test('(type = "int8")', () => {
    number(0, { type: 'int8' }, 1);
    number(127, { type: 'int8' }, 1);
    number(-128, { type: 'int8' }, 1);
    throws(() => number(128, { type: 'int8' }, 2));
    throws(() => number(-129, { type: 'int8' }, 2));
  });

  test('(type = "uint")', () => {
    number(0, { type: 'uint' }, 1);
    number(127, { type: 'uint' }, 1);
    number(128, { type: 'uint' }, 2);
    number(255, { type: 'uint' }, 2);
    number(16_383, { type: 'uint' }, 2);
    number(16_384, { type: 'uint' }, 3);
    number(2_147_483_647, { type: 'uint' }, 5);
    number(2_147_483_648, { type: 'uint' }, 5);
    number(Number.MAX_SAFE_INTEGER, { type: 'uint' }, 8);
  });

  test('(type = "uint8")', () => {
    number(0, { type: 'uint8' }, 1);
    number(127, { type: 'uint8' }, 1);
    number(128, { type: 'uint8' }, 1);
    number(255, { type: 'uint8' }, 1);
    throws(() => number(16_383, { type: 'uint8' }, 2));
  });
});
