import { describe, expect, test } from 'vitest';
import {
  PrimitiveType,
  readPrimitive,
  writePrimitive,
  type PrimitiveTypeValueMap,
} from './primitives.js';

const BUFFER = new ArrayBuffer(32);
const VIEW = new DataView(BUFFER);

const assert = <Type extends PrimitiveType>(
  type: Type,
  input: PrimitiveTypeValueMap[Type],
) => {
  writePrimitive({ offset: 0, view: VIEW }, type, input);
  const output = readPrimitive({ offset: 0, view: VIEW }, type);
  expect(input).toBe(output);
};

test('Float32', () => {
  assert(PrimitiveType.Float32, 0);
  assert(PrimitiveType.Float32, 1.5);
});

test('Float64', () => {
  assert(PrimitiveType.Float64, 0);
  assert(PrimitiveType.Float64, Math.PI);
});

test('Int8', () => {
  assert(PrimitiveType.Int8, -(2 ** 7));
  assert(PrimitiveType.Int8, 0);
  assert(PrimitiveType.Int8, 2 ** 7 - 1);
});

test('Int16', () => {
  assert(PrimitiveType.Int16, -(2 ** 15));
  assert(PrimitiveType.Int16, 0);
  assert(PrimitiveType.Int16, 2 ** 15 - 1);
});

test('Int32', () => {
  assert(PrimitiveType.Int32, -(2 ** 31));
  assert(PrimitiveType.Int32, 0);
  assert(PrimitiveType.Int32, 2 ** 31 - 1);
});

test('Int64', () => {
  assert(PrimitiveType.Int64, -(2n ** 63n));
  assert(PrimitiveType.Int64, 0n);
  assert(PrimitiveType.Int64, 2n ** 63n - 1n);
});

test('Uint8', () => {
  assert(PrimitiveType.Uint8, 0);
  assert(PrimitiveType.Uint8, 2 ** 8 - 1);
});

test('Uint16', () => {
  assert(PrimitiveType.Uint16, 0);
  assert(PrimitiveType.Uint16, 2 ** 16 - 1);
});

test('Uint32', () => {
  assert(PrimitiveType.Uint32, 0);
  assert(PrimitiveType.Uint32, 2 ** 32 - 1);
});

test('Uint64', () => {
  assert(PrimitiveType.Uint64, 0n);
  assert(PrimitiveType.Uint64, 2n ** 64n - 1n);
});

describe('VLQ', () => {
  test('one byte', () => {
    assert(PrimitiveType.VLQ, 0);
    assert(PrimitiveType.VLQ, 127);
  });

  test('two bytes', () => {
    assert(PrimitiveType.VLQ, 128);
    assert(PrimitiveType.VLQ, 8192);
    assert(PrimitiveType.VLQ, 16_383);
  });

  test('three bytes', () => {
    assert(PrimitiveType.VLQ, 16_384);
    assert(PrimitiveType.VLQ, 2_097_151);
  });

  test('four bytes', () => {
    assert(PrimitiveType.VLQ, 2_097_152);
    assert(PrimitiveType.VLQ, 134_217_728);
    assert(PrimitiveType.VLQ, 268_435_455);
    assert(PrimitiveType.VLQ, 1_073_741_824);
    assert(PrimitiveType.VLQ, 2_130_706_432);
    assert(PrimitiveType.VLQ, 2_147_483_647);
  });

  test('out of range', () => {
    expect(() =>
      writePrimitive(
        { offset: 0, view: VIEW },
        PrimitiveType.VLQ,
        2_147_483_648,
      ),
    ).toThrow();
  });
});
