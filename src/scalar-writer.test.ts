import { expect, test } from 'vitest';
import { $ } from './factory.js';
import { ScalarWriter } from './scalar-writer.js';
import type { ScalarValueMap } from './scalar.js';
import { type Scalar } from './scalar.js';

const write = <ThisScalar extends Scalar>(
  scalar: ThisScalar,
  value: ScalarValueMap[ThisScalar[0]],
) => {
  const buffer = Buffer.allocUnsafe(32);
  const offset = new ScalarWriter(buffer).writeScalar(scalar, value);
  return [...buffer.subarray(0, offset)];
};

test.skip('bitArray', () => {
  expect(write($.bitArray(8), [0b1100_0101])).toEqual([1, 1, 0, 0, 0, 1, 0, 1]);
});

test('float32', () => {
  expect(write($.float32(), 3.5)).toEqual([0x40, 0x60, 0x00, 0x00]);
});

test('float64', () => {
  expect(write($.float64(), 3.141_592_65)).toEqual([
    0x40, 0x09, 0x21, 0xfb, 0x53, 0xc8, 0xd4, 0xf1,
  ]);
});

test('int', () => {
  expect(write($.int(1), 0)).toEqual([0]);
  expect(write($.int(1), 127)).toEqual([127]);
  expect(write($.int(1), -128)).toEqual([128]);
  expect(write($.int(2), 0x01_23)).toEqual([0x01, 0x23]);
  expect(write($.int(2), 0x01_23)).toEqual([0x01, 0x23]);
  expect(write($.int(3), 0x01_23_45)).toEqual([0x01, 0x23, 0x45]);
  expect(write($.int(4), 0x01_23_45_67)).toEqual([0x01, 0x23, 0x45, 0x67]);
  expect(write($.int(5), 0x01_23_45_67_89)).toEqual([
    0x01, 0x23, 0x45, 0x67, 0x89,
  ]);
  expect(write($.int(6), 0x01_23_45_67_89_ab)).toEqual([
    0x01, 0x23, 0x45, 0x67, 0x89, 0xab,
  ]);
});

test('int8', () => {
  expect(write($.int8(), 0)).toEqual([0]);
  expect(write($.int8(), 127)).toEqual([127]);
  expect(write($.int8(), -128)).toEqual([128]);
  expect(write($.int8(), -1)).toEqual([255]);
});

test('int16', () => {
  expect(write($.int16(), 0x01_23)).toEqual([0x01, 0x23]);
  expect(write($.int16(), -0x78_9b)).toEqual([0x87, 0x65]);
});

test('int32', () => {
  expect(write($.int32(), 0x01_23_45_67)).toEqual([0x01, 0x23, 0x45, 0x67]);
});

test('int64', () => {
  expect(write($.int64(), 0x01_23_45_67_89_ab_cd_efn)).toEqual([
    0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef,
  ]);
});

// test('scalars', () => {
//   const buffer = Buffer.allocUnsafe(32);
//   const offset = new ScalarWriter(buffer).writeScalars(
//     [$.int64(), $.string(13)],
//     [0x01_23_45_67_89_ab_cd_efn, 'Hello! ❤️'],
//   );
//   expect([...buffer.subarray(0, offset)]).toEqual([
//     0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0x8f, 0xb8, 0xef, 0xa4,
//     0x9d, 0xe2, 0x20, 0x21, 0x6f, 0x6c, 0x6c, 0x65, 0x48,
//   ]);
// });

test('vlq', () => {
  // https://en.wikipedia.org/wiki/Variable-length_quantity#Examples
  expect(write($.vlq(), 0)).toEqual([0x00]);
  expect(write($.vlq(), 127)).toEqual([0x7f]);
  expect(write($.vlq(), 128)).toEqual([0x81, 0x00]);
});
