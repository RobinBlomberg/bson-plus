import { describe, expect, test } from 'vitest';
import type { DataTypeValueMap } from './codec.js';
import { Codec, DataType } from './codec.js';

const BUFFER = new ArrayBuffer(32);

const assert = <Type extends DataType>(
  type: Type,
  input: DataTypeValueMap[Type],
) => {
  const codec = new Codec(BUFFER);
  codec.write(type, input);
  codec.reset();
  const output = codec.read(type);
  expect(input).toBe(output);
};

describe('DataInterface', () => {
  test('Float32', () => {
    assert(DataType.Float32, 0);
    assert(DataType.Float32, 1.5);
  });

  test('Float64', () => {
    assert(DataType.Float64, 0);
    assert(DataType.Float64, Math.PI);
  });

  test('Int8', () => {
    assert(DataType.Int8, -(2 ** 7));
    assert(DataType.Int8, 0);
    assert(DataType.Int8, 2 ** 7 - 1);
  });

  test('Int16', () => {
    assert(DataType.Int16, -(2 ** 15));
    assert(DataType.Int16, 0);
    assert(DataType.Int16, 2 ** 15 - 1);
  });

  test('Int32', () => {
    assert(DataType.Int32, -(2 ** 31));
    assert(DataType.Int32, 0);
    assert(DataType.Int32, 2 ** 31 - 1);
  });

  test('Int64', () => {
    assert(DataType.Int64, -(2n ** 63n));
    assert(DataType.Int64, 0n);
    assert(DataType.Int64, 2n ** 63n - 1n);
  });

  test('Uint8', () => {
    assert(DataType.Uint8, 0);
    assert(DataType.Uint8, 2 ** 8 - 1);
  });

  test('Uint16', () => {
    assert(DataType.Uint16, 0);
    assert(DataType.Uint16, 2 ** 16 - 1);
  });

  test('Uint32', () => {
    assert(DataType.Uint32, 0);
    assert(DataType.Uint32, 2 ** 32 - 1);
  });

  test('Uint64', () => {
    assert(DataType.Uint64, 0n);
    assert(DataType.Uint64, 2n ** 64n - 1n);
  });

  describe('VLQ', () => {
    test('one byte', () => {
      assert(DataType.VLQ, 0);
      assert(DataType.VLQ, 127);
    });

    test('two bytes', () => {
      assert(DataType.VLQ, 128);
      assert(DataType.VLQ, 8192);
      assert(DataType.VLQ, 16_383);
    });

    test('three bytes', () => {
      assert(DataType.VLQ, 16_384);
      assert(DataType.VLQ, 2_097_151);
    });

    test('four bytes', () => {
      assert(DataType.VLQ, 2_097_152);
      assert(DataType.VLQ, 134_217_728);
      assert(DataType.VLQ, 268_435_455);
      assert(DataType.VLQ, 1_073_741_824);
      assert(DataType.VLQ, 2_130_706_432);
      assert(DataType.VLQ, 2_147_483_647);
    });

    test('out of range', () => {
      expect(() =>
        new Codec(BUFFER).write(DataType.VLQ, 2_147_483_648),
      ).toThrow();
    });
  });
});
