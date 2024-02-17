import { strictEqual } from 'assert';
import { test } from 'vitest';
import { readBigUintv, writeBigUintv } from './uintv.js';

const dataView = new DataView(new ArrayBuffer(32));

const uintv = (input: bigint) => {
  writeBigUintv([dataView, 0], input);
  const output = readBigUintv([dataView, 0]);
  strictEqual(output, input);
};

test('uintv', () => {
  uintv(123_456n);
  uintv(12_345_678_901_234_567_890n);
  uintv(123_456_789_012_345_678_901_234_567_890n);
});
