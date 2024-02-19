import { deepStrictEqual } from 'assert';
import { describe, it } from 'vitest';
import { readBitset, writeBitset } from './bitset.js';
import type { Iterator } from './iterator.js';

const dataView = new DataView(new ArrayBuffer(32));

const bitset = (input: number[], expectedLength?: number) => {
  const valueLengths = input.map((v) =>
    v === 0 ? 1 : Math.ceil(Math.log2(v + 1)),
  );

  // Write:
  const iterator: Iterator = [dataView, 0];
  writeBitset(iterator, valueLengths, input);
  const writeLength = iterator[1];

  // Read:
  iterator[1] = 0;
  const output = readBitset(iterator, valueLengths);
  const readLength = iterator[1];

  // Assertions:
  deepStrictEqual(output, input);

  if (expectedLength !== undefined) {
    deepStrictEqual(writeLength, expectedLength);
    deepStrictEqual(readLength, expectedLength);
  }
};

describe('bitset', () => {
  it('should support 9-byte values', () => {
    bitset([], 0);
    bitset([0], 1);
    bitset([0, 0], 1);
    bitset([1], 1);
    bitset([1, 0], 1);
    bitset([1, 0, 1], 1);
    bitset([1, 2, 3], 1);
    bitset([0, 0, 1, 9, 21, 0], 2);
    bitset([1, 0, 1, 3, 1, 0, 9, 10], 2);
    bitset([1, 2, 3, 4, 5], 2);
    bitset([1, 5, 0, 0, 7], 2);
    bitset([4, 4, 4], 2);
    bitset([512], 2);
    bitset([200, 500], 3);
    bitset([1, 2, 3, 4, 5, 6, 7], 3);
    bitset([1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], 4);
    bitset([200, 513, 500, 300], 5);
    bitset([10, 0, 9, 1, 8, 2, 7, 3, 6, 4, 5, 5], 5);
    bitset([
      29, 23, 32, 25, 1, 31, 4, 30, 5, 16, 22, 17, 8, 19, 28, 10, 13, 26,
    ]);
    bitset([
      3, 4, 28, 29, 14, 9, 15, 31, 1, 25, 26, 11, 13, 5, 24, 32, 2, 17, 6,
    ]);

    for (let i = 0; i < 100; i++) {
      bitset(
        Array.from({ length: Math.round(Math.random() * 20) }, () =>
          Math.floor(Math.random() * 10),
        ),
      );
      bitset(
        Array.from({ length: Math.round(Math.random() * 20) }, () =>
          Math.floor(Math.random() * 512),
        ),
      );
    }
  });

  it('should read multi-byte values correctly', () => {
    bitset([64, 512], 3);

    for (let i = 0; i < 500; i++) {
      bitset(
        Array.from({ length: Math.round(Math.random() * 10) }, () =>
          Math.floor(Math.random() * 8192),
        ),
      );
    }
  });
});
