import { strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import {
  readBigIntv,
  readIntv,
  readSmallIntv,
  writeBigIntv,
  writeIntv,
  writeSmallIntv,
} from './intv.js';
import type { Iterator } from './iterator.js';

const dataView = new DataView(new ArrayBuffer(32));

const createAssert = <Value extends bigint | number>(
  read: (iterator: Iterator) => bigint | number,
  write: (iterator: Iterator, value: Value) => void,
) => {
  return (input: Value, expectedLength?: number) => {
    for (const value of [input, -input as Value]) {
      if (Object.is(value, -0)) continue;

      // Write:
      const iterator: Iterator = [dataView, 0];
      write(iterator, value);
      const writeLength = iterator[1];

      // Read:
      iterator[1] = 0;
      const output = read(iterator);
      const readLength = iterator[1];

      // Assertions:
      strictEqual(output, value);

      if (expectedLength !== undefined) {
        strictEqual(writeLength, expectedLength);
        strictEqual(readLength, expectedLength);
      }
    }
  };
};

const bigIntv = createAssert(readBigIntv, writeBigIntv);
const smallIntv = createAssert(readSmallIntv, writeSmallIntv);
const intv = createAssert(readIntv, writeIntv);

describe('intv', () => {
  test('bigIntv', () => {
    bigIntv(0n, 1);
    bigIntv(63n, 1);
    bigIntv(64n, 2);
    bigIntv(123_456n, 3);
    bigIntv(12_345_678_901_234_567_890n, 10);
    bigIntv(123_456_789_012_345_678_901_234_567_890n, 14);

    for (let i = 0; i < 500; i++) {
      bigIntv(
        BigInt(
          Math.round(
            (Math.random() *
              (Number.MAX_SAFE_INTEGER + Number.MIN_SAFE_INTEGER)) /
              2,
          ),
        ),
      );
    }
  });

  test('smallIntv', () => {
    smallIntv(0, 1);
    smallIntv(63, 1);
    smallIntv(64, 2);
    smallIntv(255, 2);
    smallIntv(8191, 2);
    smallIntv(8192, 3);
    smallIntv(2_147_483_647, 5);
    throws(() => smallIntv(2_147_483_648));
  });

  test('intv', () => {
    intv(0, 1);
    intv(63, 1);
    intv(64, 2);
    intv(255, 2);
    intv(8191, 2);
    intv(8192, 3);
    intv(2_147_483_647, 5);
    intv(2_147_483_648, 5);
    intv(Number.MIN_SAFE_INTEGER, 8);
    intv(Number.MAX_SAFE_INTEGER, 8);
  });
});
