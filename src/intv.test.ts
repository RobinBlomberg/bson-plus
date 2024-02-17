import { strictEqual } from 'assert';
import { test } from 'vitest';
import { readBigIntv, writeBigIntv } from './intv.js';
import type { Iterator } from './iterator.js';

const dataView = new DataView(new ArrayBuffer(32));

const intv = (input: bigint, expectedLength: number) => {
  for (const value of [input, -input]) {
    // Write:
    const iterator: Iterator = [dataView, 0];
    writeBigIntv(iterator, value);
    const writeLength = iterator[1];

    // Read:
    iterator[1] = 0;
    const output = readBigIntv(iterator);
    const readLength = iterator[1];

    // Assertions:
    strictEqual(output, value);
    strictEqual(writeLength, expectedLength);
    strictEqual(readLength, expectedLength);
  }
};

test('intv', () => {
  intv(0n, 1);
  intv(63n, 1);
  intv(64n, 2);
  intv(123_456n, 3);
  intv(12_345_678_901_234_567_890n, 10);
  intv(123_456_789_012_345_678_901_234_567_890n, 14);
});
