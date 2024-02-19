import { read, write } from '../atoms/atoms.js';
import type { Iterator } from '../atoms/iterator.js';
import type { NumberSchema } from './schemas.js';

export const readNumber = (iterator: Iterator, schema?: NumberSchema) => {
  return read(iterator, { type: schema?.type ?? 'Decimal' });
};

export const writeNumber = (
  iterator: Iterator,
  value: number,
  schema?: NumberSchema,
) => {
  return write(iterator, { type: schema?.type ?? 'Decimal' }, value);
};
