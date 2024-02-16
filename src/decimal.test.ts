import { strictEqual } from 'assert';
import { describe, test } from 'vitest';
import { readDecimal, writeDecimal } from './decimal.js';

const dataView = new DataView(new ArrayBuffer(32));

const decimal = (input: number, expectedLength: number) => {
  for (const value of [input, -input]) {
    const length = writeDecimal([dataView, 0], value);
    const output = readDecimal([dataView, 0]);
    strictEqual(output, value);
    strictEqual(length, expectedLength);
  }
};

describe('decimal', () => {
  test('fractions', () => {
    decimal(0.142_857_142_857_142_85, 9);
    decimal(0.214_748_364_7, 6);
    decimal(0.5, 2);
    decimal(0.900_719_925_474_099_1, 9);
    decimal(3.141_592_653_589_793, 9);
    decimal(98.76, 3);
    decimal(123.456, 4);
    decimal(281_522.807_123_860_17, 9);
    decimal(8_723_817.801_286_17, 9);
  });

  test('integers', () => {
    decimal(0, 2);
    decimal(127, 2);
    decimal(128, 3);
    decimal(16_383, 3);
    decimal(16_384, 4);
    decimal(2_147_483_647, 6);
    decimal(9_007_199_254_740_991, 9);
  });
});
