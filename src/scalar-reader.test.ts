import { expect, test } from 'vitest';
import { ScalarReader } from './scalar-reader.js';
import { ScalarType, type Scalar } from './scalar.js';

const read = (scalar: Scalar, data: number[]) => {
  return new ScalarReader(Buffer.from(data)).readScalar(scalar);
};

const $ = {
  bitArray: (length: number) => [ScalarType.BIT_ARRAY, length] as const,
  float32: () => [ScalarType.FLOAT32] as const,
  float64: () => [ScalarType.FLOAT64] as const,
  int: (length: number) => [ScalarType.INT, length] as const,
  int8: () => [ScalarType.INT8] as const,
  int16: () => [ScalarType.INT16] as const,
  int32: () => [ScalarType.INT32] as const,
  int64: () => [ScalarType.INT64] as const,
  signedVlq: () => [ScalarType.SIGNED_VLQ] as const,
  string: (length: number) => [ScalarType.STRING, length] as const,
  uint: (length: number) => [ScalarType.UINT, length] as const,
  uint8: () => [ScalarType.UINT8] as const,
  uint16: () => [ScalarType.UINT16] as const,
  uint32: () => [ScalarType.UINT32] as const,
  uint64: () => [ScalarType.UINT64] as const,
  vlq: () => [ScalarType.VLQ] as const,
};

test('readBitArray', () => {
  expect(read($.bitArray(8), [0b1100_0101])).toEqual([1, 1, 0, 0, 0, 1, 0, 1]);
});

test('float32', () => {
  expect(read($.float32(), [0x40, 0x60, 0x00, 0x00])).toBe(3.5);
});

test('float64', () => {
  expect(
    read($.float64(), [0x40, 0x09, 0x21, 0xfb, 0x53, 0xc8, 0xd4, 0xf1]),
  ).toBe(3.141_592_65);
});

test('int', () => {
  expect(read($.int(1), [0])).toBe(0);
  expect(read($.int(1), [127])).toBe(127);
  expect(read($.int(1), [128])).toBe(-128);
  expect(read($.int(1), [255])).toBe(-1);
  expect(read($.int(2), [0x01, 0x23])).toBe(0x01_23);
  expect(read($.int(2), [0x01, 0x23])).toBe(0x01_23);
  expect(read($.int(3), [0x01, 0x23, 0x45])).toBe(0x01_23_45);
  expect(read($.int(4), [0x01, 0x23, 0x45, 0x67])).toBe(0x01_23_45_67);
  expect(read($.int(5), [0x01, 0x23, 0x45, 0x67, 0x89])).toBe(0x01_23_45_67_89);
  expect(read($.int(6), [0x01, 0x23, 0x45, 0x67, 0x89, 0xab])).toBe(
    0x01_23_45_67_89_ab,
  );
});

test('int8', () => {
  expect(read($.int8(), [0])).toBe(0);
  expect(read($.int8(), [127])).toBe(127);
  expect(read($.int8(), [128])).toBe(-128);
  expect(read($.int8(), [255])).toBe(-1);
});

test('int16', () => {
  expect(read($.int16(), [0x01, 0x23])).toBe(0x01_23);
  expect(read($.int16(), [0x87, 0x65])).toBe(-0x78_9b);
});

test('int32', () => {
  expect(read($.int32(), [0x01, 0x23, 0x45, 0x67])).toBe(0x01_23_45_67);
});

test('int64', () => {
  expect(
    read($.int64(), [0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef]),
  ).toBe(0x01_23_45_67_89_ab_cd_efn);
});

test('signedVlq', () => {
  expect(read($.signedVlq(), [0b1000_0001, 0b0000_1001])).toBe(137);
  expect(read($.signedVlq(), [0b1100_0001, 0b0000_1001])).toBe(-137);
});

test('string', () => {
  expect(
    read(
      $.string(13),
      [
        0x8f, 0xb8, 0xef, 0xa4, 0x9d, 0xe2, 0x20, 0x21, 0x6f, 0x6c, 0x6c, 0x65,
        0x48,
      ],
    ),
  ).toBe('Hello! ❤️');
});

test('uint', () => {
  expect(read($.uint(1), [0])).toBe(0);
  expect(read($.uint(1), [127])).toBe(127);
  expect(read($.uint(1), [128])).toBe(128);
  expect(read($.uint(1), [255])).toBe(255);
  expect(read($.uint(2), [0x01, 0x23])).toBe(0x01_23);
  expect(read($.uint(2), [0x01, 0x23])).toBe(0x01_23);
  expect(read($.uint(3), [0x01, 0x23, 0x45])).toBe(0x01_23_45);
  expect(read($.uint(4), [0x01, 0x23, 0x45, 0x67])).toBe(0x01_23_45_67);
  expect(read($.uint(5), [0x01, 0x23, 0x45, 0x67, 0x89])).toBe(
    0x01_23_45_67_89,
  );
  expect(read($.uint(6), [0x01, 0x23, 0x45, 0x67, 0x89, 0xab])).toBe(
    0x01_23_45_67_89_ab,
  );
});

test('uint8', () => {
  expect(read($.uint8(), [0])).toBe(0);
  expect(read($.uint8(), [127])).toBe(127);
  expect(read($.uint8(), [128])).toBe(128);
  expect(read($.uint8(), [255])).toBe(255);
});

test('uint16', () => {
  expect(read($.uint16(), [0x01, 0x23])).toBe(0x01_23);
  expect(read($.uint16(), [0x87, 0x65])).toBe(0x87_65);
});

test('uint32', () => {
  expect(read($.uint32(), [0x01, 0x23, 0x45, 0x67])).toBe(0x01_23_45_67);
});

test('uint64', () => {
  expect(
    read($.uint64(), [0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef]),
  ).toBe(0x01_23_45_67_89_ab_cd_efn);
});

test('vlq', () => {
  // https://en.wikipedia.org/wiki/Variable-length_quantity#Examples
  expect(read($.vlq(), [0x00])).toBe(0);
  expect(read($.vlq(), [0x7f])).toBe(127);
  expect(read($.vlq(), [0x81, 0x00])).toBe(128);
  expect(read($.vlq(), [0xc0, 0x00])).toBe(8192);
  expect(read($.vlq(), [0xff, 0x7f])).toBe(16_383);
  expect(read($.vlq(), [0x81, 0x80, 0x00])).toBe(16_384);
  expect(read($.vlq(), [0xff, 0xff, 0x7f])).toBe(2_097_151);
  expect(read($.vlq(), [0x81, 0x80, 0x80, 0x00])).toBe(2_097_152);
  expect(read($.vlq(), [0xc0, 0x80, 0x80, 0x00])).toBe(134_217_728);
  expect(read($.vlq(), [0xff, 0xff, 0xff, 0x7f])).toBe(268_435_455);
});
