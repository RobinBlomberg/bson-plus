import { strictEqual } from 'assert';
import { test } from 'vitest';
import { readDecimal, writeDecimal } from './decimal.js';
import type { Iterator } from './iterator.js';

const dataView = new DataView(new ArrayBuffer(32));

const decimal = (input: number, expectedLength: number) => {
  for (const value of [input, -input]) {
    // Write:
    const iterator: Iterator = [dataView, 0];
    writeDecimal(iterator, value);
    const writeLength = iterator[1];

    // Read:
    iterator[1] = 0;
    const output = readDecimal(iterator);
    const readLength = iterator[1];

    // Assertions:
    strictEqual(output, Object.is(value, -0) ? 0 : value);
    strictEqual(writeLength, expectedLength);
    strictEqual(readLength, expectedLength);
  }
};

test('decimal', () => {
  decimal(0, 2);
  decimal(1, 2);
  decimal(123.456, 4);
  decimal(3.141_592_653_589_793, 9);
  decimal(9_007_199_254_740_991, 9);
  decimal(9_007_199.254_740_991, 9);
});
