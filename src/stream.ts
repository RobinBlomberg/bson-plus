import { readBitset, writeBitset } from './bitset.js';
import { readDecimal, writeDecimal } from './decimal.js';
import type { InputFor } from './input.js';
import {
  readBigInt,
  readInt,
  readSmallInt,
  writeBigInt,
  writeInt,
  writeSmallInt,
} from './int.js';
import type { Iterator } from './iterator.js';
import type { Schema } from './schema.js';
import { Type } from './type.js';
import {
  readBigUint,
  readSmallUint,
  readUint,
  writeBigUint,
  writeSmallUint,
  writeUint,
} from './uint.js';

export const read = (iterator: Iterator, schema: Schema) => {
  switch (schema.type) {
    case Type.BigInt:
      return readBigInt(iterator);
    case Type.BigInt64: {
      const value = iterator[0].getBigInt64(iterator[1]);
      iterator[1] += 8;
      return value;
    }
    case Type.BigUint:
      return readBigUint(iterator);
    case Type.BigUint64: {
      const value = iterator[0].getBigUint64(iterator[1]);
      iterator[1] += 8;
      return value;
    }
    case Type.Bitset:
      return readBitset(iterator, schema.valueLengths);
    case Type.Decimal:
      return readDecimal(iterator);
    case Type.Float32: {
      const value = iterator[0].getFloat32(iterator[1]);
      iterator[1] += 4;
      return value;
    }
    case Type.Float64: {
      const value = iterator[0].getFloat64(iterator[1]);
      iterator[1] += 8;
      return value;
    }
    case Type.Int:
      return readInt(iterator);
    case Type.Int8:
      return iterator[0].getInt8(iterator[1]++);
    case Type.Int16: {
      const value = iterator[0].getInt16(iterator[1]);
      iterator[1] += 2;
      return value;
    }
    case Type.Int32: {
      const value = iterator[0].getInt32(iterator[1]);
      iterator[1] += 4;
      return value;
    }
    case Type.SmallInt:
      return readSmallInt(iterator);
    case Type.SmallUint:
      return readSmallUint(iterator);
    case Type.Uint:
      return readUint(iterator);
    case Type.Uint8:
      return iterator[0].getUint8(iterator[1]++);
    case Type.Uint16: {
      const value = iterator[0].getUint16(iterator[1]);
      iterator[1] += 2;
      return value;
    }
    case Type.Uint32: {
      const value = iterator[0].getUint32(iterator[1]);
      iterator[1] += 4;
      return value;
    }
  }
};

export const write = <ThisSchema extends Schema>(
  iterator: Iterator,
  schema: ThisSchema,
  input: InputFor[ThisSchema['type']],
) => {
  switch (schema.type) {
    case Type.BigInt:
      return writeBigInt(iterator, input as bigint);
    case Type.BigInt64:
      iterator[0].setBigInt64(iterator[1], input as bigint);
      iterator[1] += 8;
      break;
    case Type.BigUint:
      return writeBigUint(iterator, input as bigint);
    case Type.BigUint64:
      iterator[0].setBigUint64(iterator[1], input as bigint);
      iterator[1] += 8;
      break;
    case Type.Bitset:
      return writeBitset(iterator, schema.valueLengths, input as number[]);
    case Type.Decimal:
      return writeDecimal(iterator, input as number);
    case Type.Float32:
      iterator[0].setFloat32(iterator[1], input as number);
      iterator[1] += 4;
      break;
    case Type.Float64:
      iterator[0].setFloat64(iterator[1], input as number);
      iterator[1] += 8;
      break;
    case Type.Int:
      return writeInt(iterator, input as number);
    case Type.Int8:
      return iterator[0].setInt8(iterator[1]++, input as number);
    case Type.Int16:
      iterator[0].setInt16(iterator[1], input as number);
      iterator[1] += 2;
      break;
    case Type.Int32:
      iterator[0].setInt32(iterator[1], input as number);
      iterator[1] += 4;
      break;
    case Type.SmallInt:
      return writeSmallInt(iterator, input as number);
    case Type.SmallUint:
      return writeSmallUint(iterator, input as number);
    case Type.Uint:
      return writeUint(iterator, input as number);
    case Type.Uint8:
      return iterator[0].setUint8(iterator[1]++, input as number);
    case Type.Uint16:
      iterator[0].setUint16(iterator[1], input as number);
      iterator[1] += 2;
      break;
    case Type.Uint32:
      iterator[0].setUint32(iterator[1], input as number);
      iterator[1] += 4;
      break;
  }
};
