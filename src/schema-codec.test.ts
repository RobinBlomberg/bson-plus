import { strictEqual } from 'assert';
import { describe, test } from 'vitest';
import type { CodecIterator } from './codecs.js';
import { schemaCodec } from './schema-codec.js';
import { any } from './schemas.js';

const buffer = new ArrayBuffer(32);
const dataView = new DataView(buffer);
const iterator: CodecIterator = { dataView, offset: 0 };

const assert = <T>(input: T, expectedLength?: number) => {
  iterator.offset = 0;
  schemaCodec.write(iterator, any(), input);
  const writeOffset = iterator.offset;

  iterator.offset = 0;
  const output = schemaCodec.read(iterator, any());
  const readOffset = iterator.offset;

  strictEqual(input, output);

  if (expectedLength !== undefined) {
    strictEqual(writeOffset, expectedLength);
    strictEqual(readOffset, expectedLength);
  }
};

describe('schemaCodec', () => {
  test('bigint', () => {
    assert(-9_223_372_036_854_775_808n, 11);
    assert(0n, 2);
    assert(123_456_789_012_345_678_901_234_567_890n, 15);
  });

  test('boolean', () => {
    assert(false, 1);
    assert(true, 1);
  });

  test('number', () => {
    assert(9_007_199.254_740_991, 10);
    assert(-9_007_199.254_740_991, 10);
  });
});
