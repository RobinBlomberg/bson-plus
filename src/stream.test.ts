import { deepStrictEqual, strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import type {
  Processor,
  ProcessorTailParameters,
  Processors,
} from './stream.js';
import { createStream } from './stream.js';

describe('stream', () => {
  const buffer = new ArrayBuffer(32);
  const dataView = new DataView(buffer);
  const stream = createStream(dataView);

  const fail = <Type extends keyof Processors>(
    type: Type,
    input: Processors[Type] extends Processor<infer Input, any, any>
      ? Input
      : never,
    ...args: ProcessorTailParameters<Processors[Type]>
  ) => {
    stream.setOffset(0);
    throws(() => stream.write(type, input as any, ...args));
  };

  const ok = <Type extends keyof Processors>(
    type: Type,
    input: Processors[Type] extends Processor<infer Input, any, any>
      ? Input
      : never,
    expectedLength: number,
    ...args: ProcessorTailParameters<Processors[Type]>
  ) => {
    stream.setOffset(0);
    stream.write(type, input as any, ...args);
    const writeLength = stream.getOffset();

    stream.setOffset(0);
    const output = stream.read(type, ...args);
    const readLength = stream.getOffset();

    deepStrictEqual(
      Object.is(input, -0) ? 0 : input,
      output,
      'unexpected output',
    );
    strictEqual(writeLength, expectedLength, 'unexpected writeLength');
    strictEqual(readLength, expectedLength, 'unexpected readLength');
  };

  test('bigint', () => {
    for (const sign of [1n, -1n]) {
      ok('bigint', sign * 0n, 1);
      ok('bigint', sign * 63n, 1);
      ok('bigint', sign * 64n, 2);
      ok('bigint', sign * 8191n, 2);
      ok('bigint', sign * 8192n, 3);
      ok('bigint', sign * 1_048_575n, 3);
      ok('bigint', sign * 1_048_576n, 4);
      ok('bigint', sign * 134_217_727n, 4);
      ok('bigint', sign * 134_217_728n, 5);
      ok('bigint', sign * 2_147_483_647n, 5);
      ok('bigint', sign * 2_147_483_648n, 5);
      ok('bigint', sign * BigInt(Number.MAX_SAFE_INTEGER), 8);
    }
  });

  test('biguint', () => {
    ok('biguint', 0n, 1);
    ok('biguint', 127n, 1);
    ok('biguint', 128n, 2);
    ok('biguint', 16_383n, 2);
    ok('biguint', 16_384n, 3);
    ok('biguint', 2_097_151n, 3);
    ok('biguint', 2_097_152n, 4);
    ok('biguint', 268_435_455n, 4);
    ok('biguint', 268_435_456n, 5);
    ok('biguint', 2_147_483_647n, 5);
    ok('biguint', 2_147_483_648n, 5);
    ok('biguint', BigInt(Number.MAX_SAFE_INTEGER), 8);
  });

  describe.skip('bitset', () => {
    test('0 bytes', () => {
      ok('bitset', [], 0, []);
    });

    test('1 byte', () => {
      ok('bitset', [0], 1, [1]);
      ok('bitset', [1, 1], 1, [1, 1]);
      ok('bitset', [1, 1, 1, 1, 1, 1, 1, 1], 1, [1, 1, 1, 1, 1, 1, 1, 1]);
      ok('bitset', [1, 0, 1, 0, 1, 0, 1, 0], 1, [1, 1, 1, 1, 1, 1, 1, 1]);
      ok('bitset', [3], 1, [2]);
      ok('bitset', [1, 3], 1, [1, 2]);
      ok('bitset', [3, 1], 1, [2, 1]);
      ok('bitset', [3, 3], 1, [2, 2]);
      ok('bitset', [1, 15, 3, 1], 1, [1, 4, 2, 1]);
      ok('bitset', [170], 1, [8]);
      ok('bitset', [255], 1, [8]);
    });

    test('2 bytes (cross-byte values)', () => {
      ok('bitset', [511], 2, [9]);
    });
  });

  test('decimal', () => {
    ok('decimal', 0, 2);
    ok('decimal', 13_579.2468, 5);
    ok('decimal', 3.141_592_653_589_793, 9);
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    ok('decimal', 9_876_543_210.012_345_678_9, 9);
    ok('decimal', Number.MAX_SAFE_INTEGER, 9);
  });

  test('int', () => {
    for (const sign of [1, -1]) {
      ok('int', sign * 0, 1);
      ok('int', sign * 63, 1);
      ok('int', sign * 64, 2);
      ok('int', sign * 8191, 2);
      ok('int', sign * 8192, 3);
      ok('int', sign * 1_048_575, 3);
      ok('int', sign * 1_048_576, 4);
      ok('int', sign * 134_217_727, 4);
      ok('int', sign * 134_217_728, 5);
      ok('int', sign * 2_147_483_647, 5);
      fail('int', sign * 2_147_483_648);
    }
  });

  test('uint', () => {
    ok('uint', 0, 1);
    ok('uint', 127, 1);
    ok('uint', 128, 2);
    ok('uint', 16_383, 2);
    ok('uint', 16_384, 3);
    ok('uint', 2_097_151, 3);
    ok('uint', 2_097_152, 4);
    ok('uint', 268_435_455, 4);
    ok('uint', 268_435_456, 5);
    ok('uint', 2_147_483_647, 5);
    fail('uint', 2_147_483_648);
  });
});
