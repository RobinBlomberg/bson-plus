import { strictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import { createCodec } from './codec.js';

const dataView = new DataView(new ArrayBuffer(10_000));
const codec = createCodec(dataView);

/**
 * @template {Type} T
 * @param {T} type
 * @param {T extends Type.INT64 | Type.UINT64 ? bigint : number} input
 */
const testRoundTrip = (type, input) => {
  codec.reset();
  codec.write(type, input);
  codec.reset();
  const output = codec.read(type);
  strictEqual(input, output);
};

describe('codec', () => {
  test('FLOAT16', () => {
    testRoundTrip(0, 0);
    testRoundTrip(0, 3.5);
    throws(() => testRoundTrip(0, 3.6));
  });

  test('FLOAT32', () => {
    testRoundTrip(1, 0);
    testRoundTrip(1, 3.141_592_653_589_793);
  });

  test('INT8', () => {
    testRoundTrip(2, 0);
    testRoundTrip(2, -128);
    testRoundTrip(2, 127);
    throws(() => testRoundTrip(2, -129));
    throws(() => testRoundTrip(2, 128));
  });

  test('INT16', () => {
    testRoundTrip(3, 0);
    testRoundTrip(3, -32_768);
    testRoundTrip(3, 32_767);
    throws(() => testRoundTrip(3, -32_769));
    throws(() => testRoundTrip(3, 32_768));
  });

  test('INT32', () => {
    testRoundTrip(4, 0);
    testRoundTrip(4, -2_147_483_648);
    testRoundTrip(4, 2_147_483_647);
    throws(() => testRoundTrip(4, -2_147_483_649));
    throws(() => testRoundTrip(4, 2_147_483_648));
  });

  test('INT64', () => {
    testRoundTrip(5, 0n);
    testRoundTrip(5, -9_223_372_036_854_775_808n);
    testRoundTrip(5, 9_223_372_036_854_775_807n);
    throws(() => testRoundTrip(5, -9_223_372_036_854_775_809n));
    throws(() => testRoundTrip(5, 9_223_372_036_854_775_808n));
  });

  test('LEB128', () => {
    testRoundTrip(6, 0);
    testRoundTrip(6, 127);
    testRoundTrip(6, 128);
    testRoundTrip(6, 16_383);
    testRoundTrip(6, 16_384);
    testRoundTrip(6, 2_097_151);
    testRoundTrip(6, 2_097_152);
    testRoundTrip(6, 268_435_455);
    testRoundTrip(6, 268_435_456);
    testRoundTrip(6, 2_147_483_647);
    throws(() => codec.write(6, 2_147_483_648));
  });

  test('UINT8', () => {
    testRoundTrip(7, 0);
    testRoundTrip(7, 255);
    throws(() => testRoundTrip(7, 256));
  });

  test('UINT16', () => {
    testRoundTrip(8, 0);
    testRoundTrip(8, 65_535);
    throws(() => testRoundTrip(8, 65_536));
  });

  test('UINT32', () => {
    testRoundTrip(9, 0);
    testRoundTrip(9, 4_294_967_295);
    throws(() => testRoundTrip(9, 4_294_967_296));
  });

  test('UINT64', () => {
    testRoundTrip(10, 0n);
    testRoundTrip(10, 18_446_744_073_709_551_615n);
    throws(() => testRoundTrip(10, 18_446_744_073_709_551_616n));
  });
});
