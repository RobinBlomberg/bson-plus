import { deepStrictEqual } from 'assert';
import { test } from 'vitest';
import { readBits, writeBits } from './bits.js';

const dataView = new DataView(new ArrayBuffer(32));

const bits = (input: number[]) => {
  const valueLengths = input.map((v) => Math.ceil(Math.log2(v + 1)));
  writeBits([dataView, 0], valueLengths, input);
  const output = readBits([dataView, 0], valueLengths);
  deepStrictEqual(output, input);
};

test('bits', () => {
  bits([]);
  bits([0]);
  bits([0, 0]);
  bits([0, 0, 1, 9, 21, 0]);
  bits([1]);
  bits([1, 0]);
  bits([1, 0, 1]);
  bits([1, 0, 1, 3, 1, 0, 9, 10]);
  bits([1, 2, 3]);
  bits([1, 2, 3, 4, 5]);
  bits([1, 2, 3, 4, 5, 6, 7]);
  bits([1, 5, 0, 0, 7]);
  bits([4, 4, 4]);
  bits([1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1]);
  bits([10, 0, 9, 1, 8, 2, 7, 3, 6, 4, 5, 5]);
  bits([29, 23, 32, 25, 1, 31, 4, 30, 5, 16, 22, 17, 8, 19, 28, 10, 13, 26, 2]);
  bits([3, 4, 28, 29, 14, 9, 15, 31, 1, 25, 26, 11, 13, 5, 24, 32, 2, 17, 6]);

  for (let i = 0; i < 1000; i++) {
    bits(
      Array.from({ length: Math.round(Math.random() * 20) }, () =>
        Math.floor(Math.random() * 10),
      ),
    );
    bits(
      Array.from({ length: Math.round(Math.random() * 20) }, () =>
        // Values above 512 usually fail — investigate:
        Math.floor(Math.random() * 512),
      ),
    );
  }
});
