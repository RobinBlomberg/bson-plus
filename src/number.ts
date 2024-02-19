import type { Iterator } from './iterator.js';
import type { NumberSchema } from './schema.js';
import { read, write } from './stream.js';
import { Type } from './type.js';

export const readNumber = (iterator: Iterator, schema?: NumberSchema) => {
  return read(iterator, { type: schema?.type ?? Type.Decimal });
};

export const writeNumber = (
  iterator: Iterator,
  value: number,
  schema?: NumberSchema,
) => {
  return write(iterator, { type: schema?.type ?? Type.Decimal }, value);
};
