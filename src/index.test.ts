import { strictEqual, throws } from 'assert';
import { test } from 'vitest';
import type { Codec, CodecIterator } from './index.js';
import {
  bigint64Codec,
  biguint64Codec,
  biguintvCodec,
  decimalCodec,
  int16Codec,
  int32Codec,
  int8Codec,
  uint16Codec,
  uint32Codec,
  uint8Codec,
  uintvCodec,
} from './index.js';

const buffer = new ArrayBuffer(32);
const dataView = new DataView(buffer);
const iterator: CodecIterator = { dataView, offset: 0 };

const assert = <T>(codec: Codec<T>, input: T, expectedLength?: number) => {
  iterator.offset = 0;
  codec.write(iterator, input);
  const writeOffset = iterator.offset;

  iterator.offset = 0;
  const output = codec.read(iterator);
  const readOffset = iterator.offset;

  strictEqual(input, output);

  if (expectedLength !== undefined) {
    strictEqual(writeOffset, expectedLength);
    strictEqual(readOffset, expectedLength);
  }
};

test('bigint64Codec', () => {
  const codec = bigint64Codec;
  assert(codec, -9_223_372_036_854_775_808n, 8);
  assert(codec, 9_223_372_036_854_775_807n, 8);
  throws(() => assert(codec, -9_223_372_036_854_775_809n));
  throws(() => assert(codec, 9_223_372_036_854_775_808n));
});

test('biguint64Codec', () => {
  const codec = biguint64Codec;
  assert(codec, 0n, 8);
  assert(codec, 18_446_744_073_709_551_615n, 8);
  throws(() => assert(codec, -1n));
  throws(() => assert(codec, 18_446_744_073_709_551_616n));
});

test('biguintvCodec', () => {
  const codec = biguintvCodec;
  assert(codec, 0n, 1);
  assert(codec, 127n, 1);
  assert(codec, 128n, 2);
  assert(codec, 123_456n, 3);
  assert(codec, 12_345_678_901_234_567_890n, 10);
  assert(codec, 123_456_789_012_345_678_901_234_567_890n, 14);

  for (let i = 0; i < 500; i++) {
    assert(codec, BigInt(Math.round(Math.random() * Number.MAX_SAFE_INTEGER)));
  }
});

test('decimalCodec', () => {
  const codec = decimalCodec;
  assert(codec, 0, 2);
  assert(codec, 1, 2);
  assert(codec, 123.456, 4);
  assert(codec, 3.141_592_653_589_793, 9);
  assert(codec, 9_007_199_254_740_991, 9);
  assert(codec, 9_007_199.254_740_991, 9);

  for (let i = 0; i < 500; i++) {
    assert(codec, Math.random() * 1_000_000);
  }
});

test('int8Codec', () => {
  const codec = int8Codec;
  assert(codec, -128, 1);
  assert(codec, 127, 1);
  throws(() => assert(codec, -129));
  throws(() => assert(codec, 128));
});

test('int16Codec', () => {
  const codec = int16Codec;
  assert(codec, -32_768, 2);
  assert(codec, 32_767, 2);
  throws(() => assert(codec, -32_769));
  throws(() => assert(codec, 32_768));
});

test('int32Codec', () => {
  const codec = int32Codec;
  assert(codec, -2_147_483_648, 4);
  assert(codec, 2_147_483_647, 4);
  throws(() => assert(codec, -2_147_483_649));
  throws(() => assert(codec, 2_147_483_648));
});

test('uint8Codec', () => {
  const codec = uint8Codec;
  assert(codec, 0, 1);
  assert(codec, 255, 1);
  throws(() => assert(codec, -1));
  throws(() => assert(codec, 256));
});

test('uint16Codec', () => {
  const codec = uint16Codec;
  assert(codec, 0, 2);
  assert(codec, 65_535, 2);
  throws(() => assert(codec, -1));
  throws(() => assert(codec, 65_536));
});

test('uint32Codec', () => {
  const codec = uint32Codec;
  assert(codec, 0, 4);
  assert(codec, 4_294_967_295, 4);
  throws(() => assert(codec, -1));
  throws(() => assert(codec, 4_294_967_296));
});

test('uintvCodec', () => {
  const codec = uintvCodec;
  assert(codec, 0, 1);
  assert(codec, 127, 1);
  assert(codec, 128, 2);
  assert(codec, 255, 2);
  assert(codec, 16_383, 2);
  assert(codec, 16_384, 3);
  assert(codec, 2_147_483_647, 5);
  throws(() => assert(codec, 2_147_483_648));
});
