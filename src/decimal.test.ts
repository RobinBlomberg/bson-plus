import { strictEqual } from 'assert';
import { test } from 'vitest';
import { readSmallDecimal, writeSmallDecimal } from './decimal.js';

const dataView = new DataView(new ArrayBuffer(32));

const smallDecimal = (input: number, expectedLength: number) => {
  const length = writeSmallDecimal(dataView, 0, input);
  strictEqual(length, expectedLength);
  const output = readSmallDecimal(dataView, 0);
  strictEqual(output, input);
};

test('decimal', () => {
  smallDecimal(-8192, 4);
  smallDecimal(-8191, 3);
  smallDecimal(-64, 3);
  smallDecimal(-63, 2);
  smallDecimal(0, 2);
  smallDecimal(63, 2);
  smallDecimal(64, 3);
  smallDecimal(8191, 3);
  smallDecimal(8192, 4);
  smallDecimal(123.456, 4);
  smallDecimal(-123.456, 4);
});
