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

const bigVsint = (input: bigint) => {
  writeBigVsint([dataView, 0], input);
  const output = readBigVsint([dataView, 0]);
  strictEqual(output, input);
};

const bigVuint = (input: bigint, expectedLength: number) => {
  const length = writeBigVuint([dataView, 0], input);
  const output = readBigVuint([dataView, 0]);
  strictEqual(output, input);
  strictEqual(length, expectedLength);
};

const smallVsint = (input: number, expectedLength: number) => {
  const length = writeSmallVsint([dataView, 0], input);
  const output = readSmallVsint([dataView, 0]);
  strictEqual(output, input);
  strictEqual(length, expectedLength);
};

const smallVuint = (input: number, expectedLength: number) => {
  const length = writeSmallVuint([dataView, 0], input);
  const output = readSmallVuint([dataView, 0]);
  strictEqual(output, input);
  strictEqual(length, expectedLength);
};

const vsint = (input: bigint | number) => {
  writeVsint([dataView, 0], input);
  const output = readBigVsint([dataView, 0]);
  strictEqual(output, BigInt(input));
};

const vuint = (input: bigint | number, expectedLength: number) => {
  const length = writeVuint([dataView, 0], input);
  const output = readBigVuint([dataView, 0]);
  strictEqual(output, BigInt(input));
  strictEqual(length, expectedLength);
};

describe('vsint', () => {
  describe('bigVsint', () => {
    test('-', () => {
      bigVsint(-(2n ** 6n - 1n));
      bigVsint(-(0x80_00_00_00n - 1n));
      bigVsint(-0x80_00_00_00n);
      bigVsint(-(0x80_00_00_00n + 1n));

      for (let i = 6; i * 7 < 217; i++) {
        bigVsint(-(2n ** BigInt(i * 7)));
        bigVsint(-(2n ** BigInt((i + 1) * 7) - 1n));
      }
    });

    test('+', () => {
      bigVsint(2n ** 0n);
      bigVsint(2n ** 6n - 1n);
      bigVsint(0x80_00_00_00n - 1n);
      bigVsint(0x80_00_00_00n);
      bigVsint(0x80_00_00_00n + 1n);
      bigVsint(BigInt(Number.MIN_SAFE_INTEGER));
      bigVsint(BigInt(Number.MAX_SAFE_INTEGER));

      for (let i = 6; i * 7 < 217; i++) {
        bigVsint(2n ** BigInt(i * 7));
        bigVsint(2n ** BigInt((i + 1) * 7) - 1n);
      }
    });
  });

  describe('smallVsint', () => {
    test('-', () => {
      smallVsint(-(2 ** 6 - 1), 1);
      smallVsint(-(0x80_00_00_00 - 1), 5);
      throws(() => writeSmallVsint([dataView, 0], -0x80_00_00_00));

      for (let i = 6; i * 7 < 42; i++) {
        smallVsint(-(2 ** (i * 7)), i + 1);
        smallVsint(-(2 ** ((i + 1) * 7) - 1), i + 1);
      }
    });

    test('+', () => {
      smallVsint(2 ** 0, 1);
      smallVsint(2 ** 6 - 1, 1);
      smallVsint(0x80_00_00_00 - 1, 5);
      throws(() => writeSmallVsint([dataView, 0], 0x80_00_00_00));

      for (let i = 6; i * 7 < 42; i++) {
        smallVsint(2 ** (i * 7), i + 1);
        smallVsint(2 ** ((i + 1) * 7) - 1, i + 1);
      }
    });
  });

  describe('vsint', () => {
    test('-', () => {
      vsint(-(2 ** 6 - 1));
      vsint(-(2n ** 6n - 1n));
      vsint(-(0x80_00_00_00 - 1));
      vsint(-(0x80_00_00_00n - 1n));
      vsint(-0x80_00_00_00n);
      vsint(-(0x80_00_00_00n + 1n));

      for (let i = 6; i * 7 < 217; i++) {
        vsint(-(2 ** (i * 7)));
        vsint(-(2 ** ((i + 1) * 7) - 1));
      }

      for (let i = 6; i * 7 < 217; i++) {
        vsint(-(2n ** BigInt(i * 7)));
        vsint(-(2n ** BigInt((i + 1) * 7) - 1n));
      }
    });

    test('+', () => {
      vsint(2 ** 0);
      vsint(2n ** 0n);
      vsint(2 ** 6 - 1);
      vsint(2n ** 6n - 1n);
      vsint(0x80_00_00_00 - 1);
      vsint(0x80_00_00_00n - 1n);
      vsint(0x80_00_00_00);
      vsint(0x80_00_00_00n);
      vsint(0x80_00_00_00 + 1);
      vsint(0x80_00_00_00n + 1n);
      vsint(Number.MIN_SAFE_INTEGER);
      vsint(Number.MAX_SAFE_INTEGER);
      vsint(BigInt(Number.MIN_SAFE_INTEGER));
      vsint(BigInt(Number.MAX_SAFE_INTEGER));

      for (let i = 6; i * 7 < 217; i++) {
        vsint(2 ** (i * 7));
        vsint(2 ** ((i + 1) * 7) - 1);
      }

      for (let i = 6; i * 7 < 217; i++) {
        vsint(2n ** BigInt(i * 7));
        vsint(2n ** BigInt((i + 1) * 7) - 1n);
      }
    });
  });
});

describe('vuint', () => {
  test('bigVuint', () => {
    bigVuint(0x80_00_00_00n - 1n, 5);
    bigVuint(0x80_00_00_00n, 5);
    bigVuint(0x80_00_00_00n + 1n, 5);
    bigVuint(BigInt(Number.MAX_SAFE_INTEGER), 8);

    for (let i = 0; i * 7 < 224; i++) {
      bigVuint(2n ** BigInt(i * 7), i + 1);
      bigVuint(2n ** BigInt((i + 1) * 7) - 1n, i + 1);
    }
  });

  test('smallVuint', () => {
    smallVuint(0x80_00_00_00 - 1, 5);
    throws(() => writeSmallVuint([dataView, 0], 0x80_00_00_00));

    for (let i = 0; i * 7 < 28; i++) {
      smallVuint(2 ** (i * 7), i + 1);
      smallVuint(2 ** ((i + 1) * 7) - 1, i + 1);
    }
  });

  test('vuint', () => {
    vuint(0x80_00_00_00 - 1, 5);
    vuint(0x80_00_00_00, 5);
    vuint(0x80_00_00_00 + 1, 5);
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
});
