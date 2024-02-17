import { strictEqual } from 'assert';
import { test } from 'vitest';
import { readDecimal, writeDecimal } from './decimal.js';

const dataView = new DataView(new ArrayBuffer(32));

const decimal = (input: number) => {
  for (const value of [input, -input]) {
    writeDecimal([dataView, 0], value);
    const output = readDecimal([dataView, 0]);
    strictEqual(output, Object.is(value, -0) ? 0 : value);
  }
};

test('decimal', () => {
  decimal(0);
  decimal(1);
  decimal(123.456);
  decimal(3.141_592_653_589_793);
  decimal(9_007_199_254_740_991);
  decimal(9_007_199.254_740_991);
});
