import { strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import type { Iterator } from './iterator.js';
import {
  readBigUint,
  readSmallUint,
  readUint,
  writeBigUint,
  writeSmallUint,
  writeUint,
} from './uint.js';

const dataView = new DataView(new ArrayBuffer(32));

const createAssert = <Value extends bigint | number>(
  read: (iterator: Iterator) => bigint | number,
  write: (iterator: Iterator, value: Value) => void,
) => {
  return (input: Value, expectedLength?: number) => {
    // Write:
    const iterator: Iterator = [dataView, 0];
    write(iterator, input);
    const writeLength = iterator[1];

    // Read:
    iterator[1] = 0;
    const output = read(iterator);
    const readLength = iterator[1];

    // Assertions:
    strictEqual(output, input);

    if (expectedLength !== undefined) {
      strictEqual(writeLength, expectedLength);
      strictEqual(readLength, expectedLength);
    }
  };
};

const bigUint = createAssert(readBigUint, writeBigUint);
const smallUint = createAssert(readSmallUint, writeSmallUint);
const uint = createAssert(readUint, writeUint);

describe('uint', () => {
  test('bigUint', () => {
    bigUint(0n, 1);
    bigUint(127n, 1);
    bigUint(128n, 2);
    bigUint(123_456n, 3);
    bigUint(12_345_678_901_234_567_890n, 10);
    bigUint(123_456_789_012_345_678_901_234_567_890n, 14);

    for (let i = 0; i < 500; i++) {
      bigUint(BigInt(Math.round(Math.random() * Number.MAX_SAFE_INTEGER)));
    }
  });

  test('smallUint', () => {
    smallUint(0, 1);
    smallUint(127, 1);
    smallUint(128, 2);
    smallUint(255, 2);
    smallUint(16_383, 2);
    smallUint(16_384, 3);
    smallUint(2_147_483_647, 5);
    throws(() => smallUint(2_147_483_648));
  });

  test('uint', () => {
    uint(0, 1);
    uint(127, 1);
    uint(128, 2);
    uint(255, 2);
    uint(16_383, 2);
    uint(16_384, 3);
    uint(2_147_483_647, 5);
    uint(2_147_483_648, 5);
    uint(Number.MAX_SAFE_INTEGER, 8);
  });
});
