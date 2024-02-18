import { readDecimal, writeDecimal } from '../atoms/decimal.js';
import { readIntv, writeIntv } from '../atoms/intv.js';
import type { Iterator } from '../atoms/iterator.js';
import { readUintv, writeUintv } from '../atoms/uintv.js';
import type { NumberSchema } from './schemas.js';

export const readNumber = (iterator: Iterator, schema: NumberSchema = {}) => {
  switch (schema.type) {
    case 'float': {
      const value = iterator[0].getFloat64(iterator[1]);
      iterator[1] += 8;
      return value;
    }
    case 'int':
      return readIntv(iterator);
    case 'int8':
      return iterator[0].getInt8(iterator[1]++);
    case 'uint':
      return readUintv(iterator);
    case 'uint8':
      return iterator[0].getUint8(iterator[1]++);
    default:
      return readDecimal(iterator);
  }
};

export const writeNumber = (
  iterator: Iterator,
  value: number,
  schema: NumberSchema = {},
) => {
  switch (schema.type) {
    case 'float': {
      iterator[0].setFloat64(iterator[1], value);
      iterator[1] += 8;
      break;
    }
    case 'int':
      writeIntv(iterator, value);
      break;
    case 'int8':
      iterator[0].setInt8(iterator[1]++, value);
      break;
    case 'uint':
      writeUintv(iterator, value);
      break;
    case 'uint8':
      iterator[0].setUint8(iterator[1]++, value);
      break;
    default:
      writeDecimal(iterator, value);
      break;
  }
};
