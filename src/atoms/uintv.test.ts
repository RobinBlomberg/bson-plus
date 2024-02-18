import { strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import type { Iterator } from './iterator.js';
import {
  readBigUintv,
  readSmallUintv,
  readUintv,
  writeBigUintv,
  writeSmallUintv,
  writeUintv,
} from './uintv.js';

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

const bigUintv = createAssert(readBigUintv, writeBigUintv);
const smallUintv = createAssert(readSmallUintv, writeSmallUintv);
const uintv = createAssert(readUintv, writeUintv);

describe('uintv', () => {
  test('bigUintv', () => {
    bigUintv(0n, 1);
    bigUintv(127n, 1);
    bigUintv(128n, 2);
    bigUintv(123_456n, 3);
    bigUintv(12_345_678_901_234_567_890n, 10);
    bigUintv(123_456_789_012_345_678_901_234_567_890n, 14);

    for (let i = 0; i < 500; i++) {
      bigUintv(BigInt(Math.round(Math.random() * Number.MAX_SAFE_INTEGER)));
    }
  });

  test('smallUintv', () => {
    smallUintv(0, 1);
    smallUintv(127, 1);
    smallUintv(128, 2);
    smallUintv(255, 2);
    smallUintv(16_383, 2);
    smallUintv(16_384, 3);
    smallUintv(2_147_483_647, 5);
    throws(() => smallUintv(2_147_483_648));
  });

  test('uintv', () => {
    uintv(0, 1);
    uintv(127, 1);
    uintv(128, 2);
    uintv(255, 2);
    uintv(16_383, 2);
    uintv(16_384, 3);
    uintv(2_147_483_647, 5);
    uintv(2_147_483_648, 5);
    uintv(Number.MAX_SAFE_INTEGER, 8);
  });
});
