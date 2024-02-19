import { readDecimal, writeDecimal } from '../atoms/decimal.js';
import { readInt, writeInt } from '../atoms/int.js';
import type { Iterator } from '../atoms/iterator.js';
import { readUint, writeUint } from '../atoms/uint.js';
import type { NumberSchema } from './schemas.js';

export const readNumber = (iterator: Iterator, schema?: NumberSchema) => {
  switch (schema?.type) {
    case 'float': {
      const value = iterator[0].getFloat64(iterator[1]);
      iterator[1] += 8;
      return value;
    }
    case 'int':
      return readInt(iterator);
    case 'int8':
      return iterator[0].getInt8(iterator[1]++);
    case 'uint':
      return readUint(iterator);
    case 'uint8':
      return iterator[0].getUint8(iterator[1]++);
    default:
      return readDecimal(iterator);
  }
};

export const writeNumber = (
  iterator: Iterator,
  value: number,
  schema?: NumberSchema,
) => {
  switch (schema?.type) {
    case 'float': {
      iterator[0].setFloat64(iterator[1], value);
      iterator[1] += 8;
      break;
    }
    case 'int':
      writeInt(iterator, value);
      break;
    case 'int8':
      iterator[0].setInt8(iterator[1]++, value);
      break;
    case 'uint':
      writeUint(iterator, value);
      break;
    case 'uint8':
      iterator[0].setUint8(iterator[1]++, value);
      break;
    default:
      writeDecimal(iterator, value);
      break;
  }
};
