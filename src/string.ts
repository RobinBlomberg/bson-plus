import type { Iterator } from './iterator.js';
import type { StringSchema } from './schema.js';
import { Type } from './type.js';
import { readSmallUint, writeBigUint, writeSmallUint } from './uint.js';

export const readString = (iterator: Iterator, schema?: StringSchema) => {
  const length = schema?.length ?? readSmallUint(iterator);

  if (schema?.type === Type.String256) {
    const dataView = iterator[0];
    let value = '';

    for (let i = 0; i < length; i++) {
      value += String.fromCharCode(dataView.getUint8(iterator[1]++));
    }

    return value;
  }

  let value = '';

  for (let i = 0; i < length; i++) {
    value += String.fromCodePoint(readSmallUint(iterator));
  }

  return value;
};

export const writeString = (
  iterator: Iterator,
  value: string,
  schema?: StringSchema,
) => {
  if (schema?.length === undefined) {
    writeBigUint(iterator, BigInt(value.length));
  }

  if (schema?.type === Type.String256) {
    const dataView = iterator[0];

    for (const character of value) {
      dataView.setUint8(iterator[1]++, character.charCodeAt(0));
    }
  } else {
    for (const character of value) {
      writeSmallUint(iterator, character.codePointAt(0)!);
    }
  }
};
