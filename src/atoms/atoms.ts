import { DataType } from '../data-type.js';
import { readBits, writeBits } from './bits.js';
import { readDecimal, writeDecimal } from './decimal.js';
import {
  readBigInt,
  readInt,
  readSmallInt,
  writeBigInt,
  writeInt,
  writeSmallInt,
} from './int.js';
import type { Iterator } from './iterator.js';
import {
  readBigUint,
  readSmallUint,
  readUint,
  writeBigUint,
  writeSmallUint,
  writeUint,
} from './uint.js';

export type AtomInputFor = {
  [DataType.BigInt]: bigint;
  [DataType.BigInt64]: bigint;
  [DataType.BigUint]: bigint;
  [DataType.BigUint64]: bigint;
  [DataType.Bits]: number[];
  [DataType.Decimal]: number;
  [DataType.Float32]: number;
  [DataType.Float64]: number;
  [DataType.Int]: bigint | number;
  [DataType.Int8]: number;
  [DataType.Int16]: number;
  [DataType.Int32]: number;
  [DataType.SmallInt]: number;
  [DataType.SmallUint]: number;
  [DataType.Uint]: bigint | number;
  [DataType.Uint8]: number;
  [DataType.Uint16]: number;
  [DataType.Uint32]: number;
};

export type AtomSchema =
  | { type: DataType.BigInt }
  | { type: DataType.BigInt64 }
  | { type: DataType.BigUint }
  | { type: DataType.BigUint64 }
  | { type: DataType.Bits; valueLengths: number[] }
  | { type: DataType.Decimal }
  | { type: DataType.Float32 }
  | { type: DataType.Float64 }
  | { type: DataType.Int }
  | { type: DataType.Int8 }
  | { type: DataType.Int16 }
  | { type: DataType.Int32 }
  | { type: DataType.SmallInt }
  | { type: DataType.SmallUint }
  | { type: DataType.Uint }
  | { type: DataType.Uint8 }
  | { type: DataType.Uint16 }
  | { type: DataType.Uint32 };

export const read = (iterator: Iterator, schema: AtomSchema) => {
  switch (schema.type) {
    case DataType.BigInt:
      return readBigInt(iterator);
    case DataType.BigInt64: {
      const value = iterator[0].getBigInt64(iterator[1]);
      iterator[1] += 8;
      return value;
    }
    case DataType.BigUint:
      return readBigUint(iterator);
    case DataType.BigUint64: {
      const value = iterator[0].getBigUint64(iterator[1]);
      iterator[1] += 8;
      return value;
    }
    case DataType.Bits:
      return readBits(iterator, schema.valueLengths);
    case DataType.Decimal:
      return readDecimal(iterator);
    case DataType.Float32: {
      const value = iterator[0].getFloat32(iterator[1]);
      iterator[1] += 4;
      return value;
    }
    case DataType.Float64: {
      const value = iterator[0].getFloat64(iterator[1]);
      iterator[1] += 8;
      return value;
    }
    case DataType.Int:
      return readInt(iterator);
    case DataType.Int8:
      return iterator[0].getInt8(iterator[1]++);
    case DataType.Int16: {
      const value = iterator[0].getInt16(iterator[1]);
      iterator[1] += 2;
      return value;
    }
    case DataType.Int32: {
      const value = iterator[0].getInt32(iterator[1]);
      iterator[1] += 4;
      return value;
    }
    case DataType.SmallInt:
      return readSmallInt(iterator);
    case DataType.SmallUint:
      return readSmallUint(iterator);
    case DataType.Uint:
      return readUint(iterator);
    case DataType.Uint8:
      return iterator[0].getUint8(iterator[1]++);
    case DataType.Uint16: {
      const value = iterator[0].getUint16(iterator[1]);
      iterator[1] += 2;
      return value;
    }
    case DataType.Uint32: {
      const value = iterator[0].getUint32(iterator[1]);
      iterator[1] += 4;
      return value;
    }
  }
};

export const write = <Schema extends AtomSchema>(
  iterator: Iterator,
  schema: Schema,
  input: AtomInputFor[Schema['type']],
) => {
  switch (schema.type) {
    case DataType.BigInt:
      return writeBigInt(iterator, input as bigint);
    case DataType.BigInt64:
      iterator[0].setBigInt64(iterator[1], input as bigint);
      iterator[1] += 8;
      break;
    case DataType.BigUint:
      return writeBigUint(iterator, input as bigint);
    case DataType.BigUint64:
      iterator[0].setBigUint64(iterator[1], input as bigint);
      iterator[1] += 8;
      break;
    case DataType.Bits:
      return writeBits(iterator, schema.valueLengths, input as number[]);
    case DataType.Decimal:
      return writeDecimal(iterator, input as number);
    case DataType.Float32:
      iterator[0].setFloat32(iterator[1], input as number);
      iterator[1] += 4;
      break;
    case DataType.Float64:
      iterator[0].setFloat64(iterator[1], input as number);
      iterator[1] += 8;
      break;
    case DataType.Int:
      return writeInt(iterator, input as number);
    case DataType.Int8:
      return iterator[0].setInt8(iterator[1]++, input as number);
    case DataType.Int16:
      iterator[0].setInt16(iterator[1], input as number);
      iterator[1] += 2;
      break;
    case DataType.Int32:
      iterator[0].setInt32(iterator[1], input as number);
      iterator[1] += 4;
      break;
    case DataType.SmallInt:
      return writeSmallInt(iterator, input as number);
    case DataType.SmallUint:
      return writeSmallUint(iterator, input as number);
    case DataType.Uint:
      return writeUint(iterator, input as number);
    case DataType.Uint8:
      return iterator[0].setUint8(iterator[1]++, input as number);
    case DataType.Uint16:
      iterator[0].setUint16(iterator[1], input as number);
      iterator[1] += 2;
      break;
    case DataType.Uint32:
      iterator[0].setUint32(iterator[1], input as number);
      iterator[1] += 4;
      break;
  }
};
