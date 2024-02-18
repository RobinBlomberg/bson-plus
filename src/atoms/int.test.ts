import { strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import {
  readBigInt,
  readInt,
  readSmallInt,
  writeBigInt,
  writeInt,
  writeSmallInt,
} from './int.js';
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

const bigInt = createAssert(readBigInt, writeBigInt);
const smallInt = createAssert(readSmallInt, writeSmallInt);
const int = createAssert(readInt, writeInt);

describe('int', () => {
  test('bigInt', () => {
    bigInt(0n, 1);
    bigInt(63n, 1);
    bigInt(64n, 2);
    bigInt(123_456n, 3);
    bigInt(12_345_678_901_234_567_890n, 10);
    bigInt(123_456_789_012_345_678_901_234_567_890n, 14);

    for (let i = 0; i < 500; i++) {
      bigInt(
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

  test('smallInt', () => {
    smallInt(0, 1);
    smallInt(63, 1);
    smallInt(64, 2);
    smallInt(255, 2);
    smallInt(8191, 2);
    smallInt(8192, 3);
    smallInt(2_147_483_647, 5);
    throws(() => smallInt(2_147_483_648));
  });

  test('int', () => {
    int(0, 1);
    int(63, 1);
    int(64, 2);
    int(255, 2);
    int(8191, 2);
    int(8192, 3);
    int(2_147_483_647, 5);
    int(2_147_483_648, 5);
    int(Number.MIN_SAFE_INTEGER, 8);
    int(Number.MAX_SAFE_INTEGER, 8);
  });
});
