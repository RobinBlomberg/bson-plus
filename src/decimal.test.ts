import { strictEqual } from 'assert';
import { test } from 'vitest';
import { readDecimal, writeDecimal } from './decimal.js';

const dataView = new DataView(new ArrayBuffer(32));

const decimal = (input: number) => {
  writeDecimal([dataView, 0], input);
  const output = readDecimal([dataView, 0]);
  strictEqual(output, input);
};

test('decimal', () => {
  decimal(123.456);
  decimal(3.141_592_653_589_793);
  decimal(9_007_199_254_740_991);
  decimal(9_007_199.254_740_991);
});
