import { deepStrictEqual, strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import { createCodec } from './codec.js';
import { DataType } from './enums.js';
import type { DataValueOfType } from './types.js';

const dataView = new DataView(new ArrayBuffer(10_000));
const codec = createCodec(dataView);

const testRoundTrip = <Type extends DataType>(
  type: Type,
  input: DataValueOfType<Type>,
) => {
  codec.reset();
  codec.write(type, input);
  codec.reset();
  const output = codec.read(type);
  strictEqual(input, output);
};

describe('codec', () => {
  describe('write/read', () => {
    test('FLOAT32', () => {
      testRoundTrip(DataType.FLOAT32, 0);
      testRoundTrip(DataType.FLOAT32, 3.5);
      throws(() => testRoundTrip(DataType.FLOAT32, 3.6));
    });

    test('FLOAT64', () => {
      testRoundTrip(DataType.FLOAT64, 0);
      testRoundTrip(DataType.FLOAT64, 3.141_592_653_589_793);
    });

    test('INT8', () => {
      testRoundTrip(DataType.INT8, 0);
      testRoundTrip(DataType.INT8, -128);
      testRoundTrip(DataType.INT8, 127);
      throws(() => testRoundTrip(DataType.INT8, -129));
      throws(() => testRoundTrip(DataType.INT8, 128));
    });

    test('INT16', () => {
      testRoundTrip(DataType.INT16, 0);
      testRoundTrip(DataType.INT16, -32_768);
      testRoundTrip(DataType.INT16, 32_767);
      throws(() => testRoundTrip(DataType.INT16, -32_769));
      throws(() => testRoundTrip(DataType.INT16, 32_768));
    });

    test('INT32', () => {
      testRoundTrip(DataType.INT32, 0);
      testRoundTrip(DataType.INT32, -2_147_483_648);
      testRoundTrip(DataType.INT32, 2_147_483_647);
      throws(() => testRoundTrip(DataType.INT32, -2_147_483_649));
      throws(() => testRoundTrip(DataType.INT32, 2_147_483_648));
    });

    test('INT64', () => {
      testRoundTrip(DataType.INT64, 0n);
      testRoundTrip(DataType.INT64, -9_223_372_036_854_775_808n);
      testRoundTrip(DataType.INT64, 9_223_372_036_854_775_807n);
      throws(() => testRoundTrip(DataType.INT64, -9_223_372_036_854_775_809n));
      throws(() => testRoundTrip(DataType.INT64, 9_223_372_036_854_775_808n));
    });

    test('LEB128', () => {
      testRoundTrip(DataType.LEB128, 0);
      testRoundTrip(DataType.LEB128, 127);
      testRoundTrip(DataType.LEB128, 128);
      testRoundTrip(DataType.LEB128, 16_383);
      testRoundTrip(DataType.LEB128, 16_384);
      testRoundTrip(DataType.LEB128, 2_097_151);
      testRoundTrip(DataType.LEB128, 2_097_152);
      testRoundTrip(DataType.LEB128, 268_435_455);
      testRoundTrip(DataType.LEB128, 268_435_456);
      testRoundTrip(DataType.LEB128, 2_147_483_647);
      throws(() => codec.write(DataType.LEB128, 2_147_483_648));
    });

    test('UINT8', () => {
      testRoundTrip(DataType.UINT8, 0);
      testRoundTrip(DataType.UINT8, 255);
      throws(() => testRoundTrip(DataType.UINT8, 256));
    });

    test('UINT16', () => {
      testRoundTrip(DataType.UINT16, 0);
      testRoundTrip(DataType.UINT16, 65_535);
      throws(() => testRoundTrip(DataType.UINT16, 65_536));
    });

    test('UINT32', () => {
      testRoundTrip(DataType.UINT32, 0);
      testRoundTrip(DataType.UINT32, 4_294_967_295);
      throws(() => testRoundTrip(DataType.UINT32, 4_294_967_296));
    });

    test('UINT64', () => {
      testRoundTrip(DataType.UINT64, 0n);
      testRoundTrip(DataType.UINT64, 18_446_744_073_709_551_615n);
      throws(() => testRoundTrip(DataType.UINT64, 18_446_744_073_709_551_616n));
    });
  });

  test('writeMany/readMany', () => {
    codec.reset();
    codec.writeMany(
      [DataType.UINT8, DataType.LEB128, DataType.LEB128, DataType.LEB128],
      [3, 97, 98, 99],
    );
    codec.reset();
    deepStrictEqual(
      codec.readMany([7, DataType.LEB128, DataType.LEB128, DataType.LEB128]),
      [3, 97, 98, 99],
    );
  });
});
