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
  BigInt: bigint;
  BigInt64: bigint;
  BigUint: bigint;
  BigUint64: bigint;
  Bits: number[];
  Decimal: number;
  Float32: number;
  Float64: number;
  Int: bigint | number;
  Int8: number;
  Int16: number;
  Int32: number;
  SmallInt: number;
  SmallUint: number;
  Uint: bigint | number;
  Uint8: number;
  Uint16: number;
  Uint32: number;
};

export type AtomSchema =
  | { type: 'BigInt' }
  | { type: 'BigInt64' }
  | { type: 'BigUint' }
  | { type: 'BigUint64' }
  | { type: 'Bits'; valueLengths: number[] }
  | { type: 'Decimal' }
  | { type: 'Float32' }
  | { type: 'Float64' }
  | { type: 'Int' }
  | { type: 'Int8' }
  | { type: 'Int16' }
  | { type: 'Int32' }
  | { type: 'SmallInt' }
  | { type: 'SmallUint' }
  | { type: 'Uint' }
  | { type: 'Uint8' }
  | { type: 'Uint16' }
  | { type: 'Uint32' };

export type AtomType = keyof AtomInputFor;

export const read = (iterator: Iterator, schema: AtomSchema) => {
  switch (schema.type) {
    case 'BigInt':
      return readBigInt(iterator);
    case 'BigInt64': {
      const value = iterator[0].getBigInt64(iterator[1]);
      iterator[1] += 8;
      return value;
    }
    case 'BigUint':
      return readBigUint(iterator);
    case 'BigUint64': {
      const value = iterator[0].getBigUint64(iterator[1]);
      iterator[1] += 8;
      return value;
    }
    case 'Bits':
      return readBits(iterator, schema.valueLengths);
    case 'Decimal':
      return readDecimal(iterator);
    case 'Float32': {
      const value = iterator[0].getFloat32(iterator[1]);
      iterator[1] += 4;
      return value;
    }
    case 'Float64': {
      const value = iterator[0].getFloat64(iterator[1]);
      iterator[1] += 8;
      return value;
    }
    case 'Int':
      return readInt(iterator);
    case 'Int8':
      return iterator[0].getInt8(iterator[1]++);
    case 'Int16': {
      const value = iterator[0].getInt16(iterator[1]);
      iterator[1] += 2;
      return value;
    }
    case 'Int32': {
      const value = iterator[0].getInt32(iterator[1]);
      iterator[1] += 4;
      return value;
    }
    case 'SmallInt':
      return readSmallInt(iterator);
    case 'SmallUint':
      return readSmallUint(iterator);
    case 'Uint':
      return readUint(iterator);
    case 'Uint8':
      return iterator[0].getUint8(iterator[1]++);
    case 'Uint16': {
      const value = iterator[0].getUint16(iterator[1]);
      iterator[1] += 2;
      return value;
    }
    case 'Uint32': {
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
    case 'BigInt':
      return writeBigInt(iterator, input as bigint);
    case 'BigInt64':
      iterator[0].setBigInt64(iterator[1], input as bigint);
      iterator[1] += 8;
      break;
    case 'BigUint':
      return writeBigUint(iterator, input as bigint);
    case 'BigUint64':
      iterator[0].setBigUint64(iterator[1], input as bigint);
      iterator[1] += 8;
      break;
    case 'Bits':
      return writeBits(iterator, schema.valueLengths, input as number[]);
    case 'Decimal':
      return writeDecimal(iterator, input as number);
    case 'Float32':
      iterator[0].setFloat32(iterator[1], input as number);
      iterator[1] += 4;
      break;
    case 'Float64':
      iterator[0].setFloat64(iterator[1], input as number);
      iterator[1] += 8;
      break;
    case 'Int':
      return writeInt(iterator, input as number);
    case 'Int8':
      return iterator[0].setInt8(iterator[1]++, input as number);
    case 'Int16':
      iterator[0].setInt16(iterator[1], input as number);
      iterator[1] += 2;
      break;
    case 'Int32':
      iterator[0].setInt32(iterator[1], input as number);
      iterator[1] += 4;
      break;
    case 'SmallInt':
      return writeSmallInt(iterator, input as number);
    case 'SmallUint':
      return writeSmallUint(iterator, input as number);
    case 'Uint':
      return writeUint(iterator, input as number);
    case 'Uint8':
      return iterator[0].setUint8(iterator[1]++, input as number);
    case 'Uint16':
      iterator[0].setUint16(iterator[1], input as number);
      iterator[1] += 2;
      break;
    case 'Uint32':
      iterator[0].setUint32(iterator[1], input as number);
      iterator[1] += 4;
      break;
  }
};
