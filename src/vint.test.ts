import { strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import {
  readBigVsint,
  readBigVuint,
  readSmallVsint,
  readSmallVuint,
  writeBigVsint,
  writeBigVuint,
  writeSmallVsint,
  writeSmallVuint,
  writeVsint,
  writeVuint,
} from './vint.js';

const dataView = new DataView(new ArrayBuffer(32));

const bigVsint = (input: bigint, expectedLength: number) => {
  const length = writeBigVsint(dataView, 0, input);
  // strictEqual(length, expectedLength);
  const output = readBigVsint(dataView, 0);
  strictEqual(output, input);
};

const bigVuint = (input: bigint, expectedLength: number) => {
  const length = writeBigVuint(dataView, 0, input);
  strictEqual(length, expectedLength);
  const output = readBigVuint(dataView, 0);
  strictEqual(output, input);
};

const smallVsint = (input: number, expectedLength: number) => {
  const length = writeSmallVsint(dataView, 0, input);
  strictEqual(length, expectedLength);
  const output = readSmallVsint(dataView, 0);
  strictEqual(output, input);
};

const smallVuint = (input: number, expectedLength: number) => {
  const length = writeSmallVuint(dataView, 0, input);
  strictEqual(length, expectedLength);
  const output = readSmallVuint(dataView, 0);
  strictEqual(output, input);
};

const vsint = (input: bigint | number, expectedLength: number) => {
  const length = writeVsint(dataView, 0, input);
  strictEqual(length, expectedLength);
  const output = readBigVsint(dataView, 0);
  strictEqual(output, BigInt(input));
};

const vuint = (input: bigint | number, expectedLength: number) => {
  const length = writeVuint(dataView, 0, input);
  strictEqual(length, expectedLength);
  const output = readBigVuint(dataView, 0);
  strictEqual(output, BigInt(input));
};

describe('vsint', () => {
  describe('arbitrary values', () => {
    test('negative values', () => {
      for (let i = 6; i * 7 < 42; i++) {
        vsint(-(2 ** (i * 7)), i + 1);
        vsint(-(2 ** ((i + 1) * 7) - 1), i + 1);
      }

      for (let i = 6; i * 7 < 42; i++) {
        vsint(-(2n ** BigInt(i * 7)), i + 1);
        vsint(-(2n ** BigInt((i + 1) * 7) - 1n), i + 1);
      }
    });

    test('non-negative values', () => {
      vsint(2n ** 0n, 1);
      vsint(2n ** 6n - 1n, 1);
      vsint(Number.MIN_SAFE_INTEGER, 8);
      vsint(Number.MAX_SAFE_INTEGER, 8);

      for (let i = 6; i * 7 < 42; i++) {
        vsint(2n ** BigInt(i * 7), i + 1);
        vsint(2n ** BigInt((i + 1) * 7) - 1n, i + 1);
      }
    });
  });

  describe('big values', () => {
    test('negative values', () => {
      for (let i = 6; i * 7 < 217; i++) {
        bigVsint(-(2n ** BigInt(i * 7)), i + 1);
        bigVsint(-(2n ** BigInt((i + 1) * 7) - 1n), i + 1);
      }
    });

    test('non-negative values', () => {
      bigVsint(2n ** 0n, 1);
      bigVsint(2n ** 6n - 1n, 1);
      bigVsint(BigInt(Number.MIN_SAFE_INTEGER), 8);
      bigVsint(BigInt(Number.MAX_SAFE_INTEGER), 8);

      for (let i = 6; i * 7 < 217; i++) {
        bigVsint(2n ** BigInt(i * 7), i + 1);
        bigVsint(2n ** BigInt((i + 1) * 7) - 1n, i + 1);
      }
    });
  });

  describe('small values', () => {
    test('negative values', () => {
      for (let i = 6; i * 7 < 42; i++) {
        smallVsint(-(2 ** (i * 7)), i + 1);
        smallVsint(-(2 ** ((i + 1) * 7) - 1), i + 1);
      }
    });

    test('non-negative values', () => {
      smallVsint(2 ** 0, 1);
      smallVsint(2 ** 6 - 1, 1);
      smallVsint(0x80_00_00_00 - 1, 5);
      throws(() => writeSmallVsint(dataView, 0, 0x80_00_00_00));

      for (let i = 6; i * 7 < 42; i++) {
        smallVsint(2 ** (i * 7), i + 1);
        smallVsint(2 ** ((i + 1) * 7) - 1, i + 1);
      }
    });
  });
});

describe('vuint', () => {
  test('arbitrary values', () => {
    vuint(0x80_00_00_00 - 1, 5);
    vuint(0x80_00_00_00, 5);
    vuint(Number.MAX_SAFE_INTEGER, 8);

    for (let i = 0; i * 7 < 49; i++) {
      vuint(2 ** (i * 7), i + 1);
      vuint(2 ** ((i + 1) * 7) - 1, i + 1);
    }

    for (let i = 0; i * 7 < 224; i++) {
      vuint(2n ** BigInt(i * 7), i + 1);
      vuint(2n ** BigInt((i + 1) * 7) - 1n, i + 1);
    }
  });

  test('big values', () => {
    bigVuint(0x80_00_00_00n - 1n, 5);
    bigVuint(0x80_00_00_00n, 5);
    bigVuint(BigInt(Number.MAX_SAFE_INTEGER), 8);

    for (let i = 0; i * 7 < 224; i++) {
      bigVuint(2n ** BigInt(i * 7), i + 1);
      bigVuint(2n ** BigInt((i + 1) * 7) - 1n, i + 1);
    }
  });

  test('small values', () => {
    smallVuint(0x80_00_00_00 - 1, 5);
    throws(() => writeSmallVuint(dataView, 0, 0x80_00_00_00));

    for (let i = 0; i * 7 < 28; i++) {
      smallVuint(2 ** (i * 7), i + 1);
      smallVuint(2 ** ((i + 1) * 7) - 1, i + 1);
    }
  });
});
