import { strictEqual } from 'assert';
import { test } from 'vitest';
import type { Iterator } from './iterator.js';
import { readBigUintv, writeBigUintv } from './uintv.js';

const dataView = new DataView(new ArrayBuffer(32));

const uintv = (input: bigint, expectedLength: number) => {
  // Write:
  const iterator: Iterator = [dataView, 0];
  writeBigUintv(iterator, input);
  const writeLength = iterator[1];

  // Read:
  iterator[1] = 0;
  const output = readBigUintv(iterator);
  const readLength = iterator[1];

  // Assertions:
  strictEqual(output, input);
  strictEqual(writeLength, expectedLength);
  strictEqual(readLength, expectedLength);
};

test('uintv', () => {
  uintv(0n, 1);
  uintv(127n, 1);
  uintv(128n, 2);
  uintv(123_456n, 3);
  uintv(12_345_678_901_234_567_890n, 10);
  uintv(123_456_789_012_345_678_901_234_567_890n, 14);
});
