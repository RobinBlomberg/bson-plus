import type { Iterator } from '../atoms/iterator.js';
import {
  readSmallUintv,
  writeBigUintv,
  writeSmallUintv,
} from '../atoms/uintv.js';
import type { StringSchema } from './schemas.js';

export const readString = (iterator: Iterator, schema: StringSchema = {}) => {
  const length = schema.length ?? readSmallUintv(iterator);

  if (schema.isUnicode256) {
    const dataView = iterator[0];
    let value = '';

    for (let i = 0; i < length; i++) {
      value += String.fromCharCode(dataView.getUint8(iterator[1]++));
    }

    return value;
  }

  let value = '';

  for (let i = 0; i < length; i++) {
    value += String.fromCodePoint(readSmallUintv(iterator));
  }

  return value;
};

export const writeString = (
  iterator: Iterator,
  value: string,
  schema: StringSchema = {},
) => {
  if (schema.length === undefined) {
    writeBigUintv(iterator, BigInt(value.length));
  }

  if (schema.isUnicode256) {
    const dataView = iterator[0];

    for (const character of value) {
      dataView.setUint8(iterator[1]++, character.charCodeAt(0));
    }
  } else {
    for (const character of value) {
      writeSmallUintv(iterator, character.codePointAt(0)!);
    }
  }
};
