import { strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import {
  readBigVuint,
  readSmallVuint,
  writeBigVuint,
  writeSmallVuint,
  writeVuint,
} from './vint.js';

const dataView = new DataView(new ArrayBuffer(9));

const bigVuint = (input: bigint, expectedLength: number) => {
  const length = writeBigVuint(dataView, 0, input);
  strictEqual(length, expectedLength);
  const output = readBigVuint(dataView, 0);
  strictEqual(output, input);
};

const smallVuint = (input: number, expectedLength: number) => {
  const length = writeSmallVuint(dataView, 0, input);
  strictEqual(length, expectedLength);
  const output = readSmallVuint(dataView, 0);
  strictEqual(output, input);
};

const vuint = (input: bigint | number, expectedOutput = input) => {
  writeVuint(dataView, 0, input);
  const output = readBigVuint(dataView, 0);
  strictEqual(output, expectedOutput);
};

describe('vsint', () => {
  test('small values', () => {});
});

describe('vuint', () => {
  test('arbitrary values', () => {
    for (let i = 0; i * 7 < 28; i++) {
      vuint(2 ** (i * 7), BigInt(2 ** (i * 7)));
      vuint(2 ** ((i + 1) * 7) - 1, BigInt(2 ** ((i + 1) * 7) - 1));
    }
    for (let i = 0; i * 7 < 63; i++) {
      vuint(2n ** BigInt(i * 7));
      vuint(2n ** BigInt((i + 1) * 7) - 1n);
    }
    throws(() => writeVuint(dataView, 0, 2n ** 63n));
  });

  test('big values', () => {
    for (let i = 0; i * 7 < 63; i++) {
      bigVuint(2n ** BigInt(i * 7), i + 1);
      bigVuint(2n ** BigInt((i + 1) * 7) - 1n, i + 1);
    }
    throws(() => writeBigVuint(dataView, 0, 2n ** 63n));
  });

  test('small values', () => {
    for (let i = 0; i * 7 < 28; i++) {
      smallVuint(2 ** (i * 7), i + 1);
      smallVuint(2 ** ((i + 1) * 7) - 1, i + 1);
    }
    smallVuint(2 ** 31 - 1, 5);
    throws(() => writeSmallVuint(dataView, 0, 2 ** 31));
  });
});
