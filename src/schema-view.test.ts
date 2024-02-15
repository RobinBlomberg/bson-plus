import { deepStrictEqual, throws } from 'assert';
import { describe, test } from 'vitest';
import { createCodec } from './codec.js';
import { createSchemaView } from './schema-view.js';
import type { Value } from './value.types.js';

const dataView = new DataView(new ArrayBuffer(32));
const codec = createCodec(dataView);
const schemaView = createSchemaView(codec);

const testRoundTrip = (input: Value, length: number) => {
  schemaView.reset();
  schemaView.write(input);
  deepStrictEqual(schemaView.getOffset(), length);
  schemaView.reset();
  deepStrictEqual(schemaView.read(), input);
  deepStrictEqual(schemaView.getOffset(), length);
};

describe('SchemaView', () => {
  test('array', () => {
    testRoundTrip([], 2);
    testRoundTrip([null, false, true, 0, 239], 7);
  });

  test('boolean', () => {
    testRoundTrip(false, 1);
    testRoundTrip(true, 1);
  });

  test('null', () => {
    testRoundTrip(null, 1);
  });

  describe('number', () => {
    test('bigint', () => {
      testRoundTrip(-2_147_483_649n, 9);
      testRoundTrip(-9_223_372_036_854_775_808n, 9);
      throws(() => testRoundTrip(-9_223_372_036_854_775_809n, 0));
    });

    test('biguint', () => {
      testRoundTrip(4_294_967_296n, 9);
      testRoundTrip(18_446_744_073_709_551_615n, 9);
      throws(() => testRoundTrip(18_446_744_073_709_551_616n, 0));
    });

    test('float', () => {
      testRoundTrip(1.5, 5);
      testRoundTrip(1.6, 9);
    });

    test('int', () => {
      testRoundTrip(-1, 2);
      testRoundTrip(-128, 2);
      testRoundTrip(-129, 3);
      testRoundTrip(-32_768, 3);
      testRoundTrip(-32_769, 5);
      testRoundTrip(-2_147_483_648, 5);
    });

    test('uint', () => {
      testRoundTrip(0, 1);
      testRoundTrip(239, 1);
      testRoundTrip(240, 2);
      testRoundTrip(255, 2);
      testRoundTrip(256, 3);
      testRoundTrip(65_535, 3);
      testRoundTrip(65_536, 5);
      testRoundTrip(4_294_967_295, 5);
    });
  });

  test('object', () => {
    testRoundTrip({ foo: 'bar' }, 11);
  });

  test('string', () => {
    testRoundTrip('Hello world! ❤️', 20);
  });
});
