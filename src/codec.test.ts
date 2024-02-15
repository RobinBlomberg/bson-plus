import { deepStrictEqual, strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import { DataType } from './codec.enums.js';
import { createCodec } from './codec.js';
import type { DataValueInput } from './codec.types.js';

const dataView = new DataView(new ArrayBuffer(8));
const codec = createCodec(dataView);

const testRoundTrip = <Type extends DataType>(
  type: Type,
  input: DataValueInput<Type>,
) => {
  codec.reset();
  codec.write(type, input);
  codec.reset();
  const output = codec.read(type);
  strictEqual(input, output);
};

describe('Codec', () => {
  describe('write/read', () => {
    test('float32', () => {
      testRoundTrip(DataType.FLOAT32, 0);
      testRoundTrip(DataType.FLOAT32, 3.5);
      throws(() => testRoundTrip(DataType.FLOAT32, 3.6));
    });

    test('float64', () => {
      testRoundTrip(DataType.FLOAT64, 0);
      testRoundTrip(DataType.FLOAT64, 3.141_592_653_589_793);
    });

    test('int8', () => {
      testRoundTrip(DataType.INT8, 0);
      testRoundTrip(DataType.INT8, -128);
      testRoundTrip(DataType.INT8, 127);
      throws(() => testRoundTrip(DataType.INT8, -129));
      throws(() => testRoundTrip(DataType.INT8, 128));
    });

    test('int16', () => {
      testRoundTrip(DataType.INT16, 0);
      testRoundTrip(DataType.INT16, -32_768);
      testRoundTrip(DataType.INT16, 32_767);
      throws(() => testRoundTrip(DataType.INT16, -32_769));
      throws(() => testRoundTrip(DataType.INT16, 32_768));
    });

    test('int32', () => {
      testRoundTrip(DataType.INT32, 0);
      testRoundTrip(DataType.INT32, -2_147_483_648);
      testRoundTrip(DataType.INT32, 2_147_483_647);
      throws(() => testRoundTrip(DataType.INT32, -2_147_483_649));
      throws(() => testRoundTrip(DataType.INT32, 2_147_483_648));
    });

    test('int64', () => {
      testRoundTrip(DataType.INT64, 0n);
      testRoundTrip(DataType.INT64, -9_223_372_036_854_775_808n);
      testRoundTrip(DataType.INT64, 9_223_372_036_854_775_807n);
      throws(() => testRoundTrip(DataType.INT64, -9_223_372_036_854_775_809n));
      throws(() => testRoundTrip(DataType.INT64, 9_223_372_036_854_775_808n));
    });

    test('leb128', () => {
      testRoundTrip(DataType.ULEB128, 0);
      testRoundTrip(DataType.ULEB128, 127);
      testRoundTrip(DataType.ULEB128, 128);
      testRoundTrip(DataType.ULEB128, 16_383);
      testRoundTrip(DataType.ULEB128, 16_384);
      testRoundTrip(DataType.ULEB128, 2_097_151);
      testRoundTrip(DataType.ULEB128, 2_097_152);
      testRoundTrip(DataType.ULEB128, 268_435_455);
      testRoundTrip(DataType.ULEB128, 268_435_456);
      testRoundTrip(DataType.ULEB128, 2_147_483_647);
      throws(() => codec.write(DataType.ULEB128, 2_147_483_648));
    });

    test('uint8', () => {
      testRoundTrip(DataType.UINT8, 0);
      testRoundTrip(DataType.UINT8, 255);
      throws(() => testRoundTrip(DataType.UINT8, 256));
    });

    test('uint16', () => {
      testRoundTrip(DataType.UINT16, 0);
      testRoundTrip(DataType.UINT16, 65_535);
      throws(() => testRoundTrip(DataType.UINT16, 65_536));
    });

    test('uint32', () => {
      testRoundTrip(DataType.UINT32, 0);
      testRoundTrip(DataType.UINT32, 4_294_967_295);
      throws(() => testRoundTrip(DataType.UINT32, 4_294_967_296));
    });

    test('uint64', () => {
      testRoundTrip(DataType.UINT64, 0n);
      testRoundTrip(DataType.UINT64, 18_446_744_073_709_551_615n);
      throws(() => testRoundTrip(DataType.UINT64, 18_446_744_073_709_551_616n));
    });
  });

  test('writeMany/readMany', () => {
    const types = [
      DataType.UINT8,
      DataType.ULEB128,
      DataType.ULEB128,
      DataType.ULEB128,
    ] as const;
    const values = [3, 97, 98, 99] as const;
    codec.reset();
    codec.writeMany(types, values);
    codec.reset();
    deepStrictEqual(codec.readMany(types), values);

    // codec.reset();
    // codec.write(DataType.UINT40, 0x12_34_56_78_9an);
    // codec.reset();
    // console.log(dataView.buffer);
  });
});
