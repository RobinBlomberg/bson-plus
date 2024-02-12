import { describe, expect, test } from 'vitest';
import type { Schema } from '../models.js';
import {
  ArraySchema,
  BooleanSchema,
  DataType,
  DoubleSchema,
  EnumSchema,
  EnumTypedSchema,
  Int16Schema,
  Int32Schema,
  Int8Schema,
  StringSchema,
  TuplePartialSchema,
  TupleSchema,
  Uint16Schema,
  Uint32Schema,
  Uint64Schema,
  Uint8Schema,
  VlqSchema,
} from '../models.js';
import { BufferAdapter } from './buffer.adapter.js';

describe('BufferAdapter', () => {
  describe('read', () => {
    const read = (schema: Schema, bytes: number[]) => {
      return new BufferAdapter(Buffer.from(bytes)).read(schema);
    };

    test('ARRAY', () => {
      expect(
        read(ArraySchema(Uint8Schema()), [0x03, 0x01, 0x02, 0x03]),
      ).toEqual([1, 2, 3]);
      expect(
        read(ArraySchema(Uint8Schema()), [0x02, 0x01, 0x02, 0x03]),
      ).toEqual([1, 2]);
    });

    test('BOOLEAN', () => {
      expect(read(BooleanSchema(), [0x01])).toBe(true);
    });

    test('DOUBLE', () => {
      expect(
        read(DoubleSchema(), [0x40, 0x09, 0x21, 0xca, 0xc0, 0x83, 0x12, 0x6f]),
      ).toBe(3.1415);
    });

    test('ENUM', () => {
      expect(read(EnumSchema(['foo', 'bar', 'baz']), [0x00])).toBe('foo');
      expect(read(EnumSchema(['foo', 'bar', 'baz']), [0x01])).toBe('bar');
      expect(read(EnumSchema(['foo', 'bar', 'baz']), [0x02])).toBe('baz');
    });

    describe('ENUM_TYPED', () => {
      test('UINT8', () => {
        expect(
          read(EnumTypedSchema(DataType.UINT8, [0, 1, 2, 4]), [0x00]),
        ).toBe(0);
        expect(
          read(EnumTypedSchema(DataType.UINT8, [0, 1, 2, 4]), [0x01]),
        ).toBe(1);
        expect(
          read(EnumTypedSchema(DataType.UINT8, [0, 1, 2, 4]), [0x02]),
        ).toBe(2);
        expect(
          read(EnumTypedSchema(DataType.UINT8, [0, 1, 2, 4]), [0x03]),
        ).toBe(4);
      });

      test('STRING', () => {
        expect(
          read(EnumTypedSchema(DataType.STRING, ['foo', 'bar', 'baz']), [0x00]),
        ).toBe('foo');
        expect(
          read(EnumTypedSchema(DataType.STRING, ['foo', 'bar', 'baz']), [0x01]),
        ).toBe('bar');
        expect(
          read(EnumTypedSchema(DataType.STRING, ['foo', 'bar', 'baz']), [0x02]),
        ).toBe('baz');
      });
    });

    test('INT8', () => {
      expect(read(Int8Schema(), [0x01])).toBe(0x01);
    });

    test('INT16', () => {
      expect(read(Int16Schema(), [0x01, 0x23])).toBe(0x01_23);
    });

    test('INT32', () => {
      expect(read(Int32Schema(), [0x01, 0x23, 0x45, 0x67])).toBe(0x01_23_45_67);
    });

    test('STRING', () => {
      expect(read(StringSchema(), [0x03, 0x61, 0x62, 0x63])).toBe('abc');
    });

    test('TUPLE', () => {
      expect(
        read(TupleSchema([Uint8Schema(), StringSchema()]), [
          7,
          3,
          'a'.charCodeAt(0),
          'b'.charCodeAt(0),
          'c'.charCodeAt(0),
        ]),
      ).toEqual([7, 'abc']);
    });

    test.skip('TUPLE_PARTIAL', () => {
      expect(
        read(TuplePartialSchema([Uint8Schema(), StringSchema()]), [
          7,
          3,
          'a'.charCodeAt(0),
          'b'.charCodeAt(0),
          'c'.charCodeAt(0),
          2,
          DataType.UINT8,
          8,
          DataType.STRING,
          3,
          'd'.charCodeAt(0),
          'e'.charCodeAt(0),
          'f'.charCodeAt(0),
        ]),
      ).toEqual([7, 'abc', 8, 'def']);
    });

    test('UINT8', () => {
      expect(read(Uint8Schema(), [0xfe])).toBe(0xfe);
    });

    test('UINT16', () => {
      expect(read(Uint16Schema(), [0xfe, 0xdc])).toBe(0xfe_dc);
    });

    test('UINT32', () => {
      expect(read(Uint32Schema(), [0xfe, 0xdc, 0xba, 0x98])).toBe(
        0xfe_dc_ba_98,
      );
    });

    test('UINT64', () => {
      expect(
        read(Uint64Schema(), [0xfe, 0xdc, 0xba, 0x98, 0x76, 0x54, 0x32, 0x10]),
      ).toBe(0xfe_dc_ba_98_76_54_32_10n);
    });

    test('VLQ', () => {
      // https://en.wikipedia.org/wiki/Variable-length_quantity#Examples
      expect(read(VlqSchema(), [0x00])).toBe(0);
      expect(read(VlqSchema(), [0x7f])).toBe(127);
      expect(read(VlqSchema(), [0x81, 0x00])).toBe(128);
      expect(read(VlqSchema(), [0xc0, 0x00])).toBe(8192);
      expect(read(VlqSchema(), [0xff, 0x7f])).toBe(16_383);
      expect(read(VlqSchema(), [0x81, 0x80, 0x00])).toBe(16_384);
      expect(read(VlqSchema(), [0xff, 0xff, 0x7f])).toBe(2_097_151);
      expect(read(VlqSchema(), [0x81, 0x80, 0x80, 0x00])).toBe(2_097_152);
      expect(read(VlqSchema(), [0xc0, 0x80, 0x80, 0x00])).toBe(134_217_728);
      expect(read(VlqSchema(), [0xff, 0xff, 0xff, 0x7f])).toBe(268_435_455);
    });
  });
});
