import { strictEqual } from 'assert';
import { describe, test } from 'vitest';
import type { Iterator } from '../atoms/iterator.js';
import type { StringSchema } from './schemas.js';
import { readString, writeString } from './string.js';

const dataView = new DataView(new ArrayBuffer(32));

const string = (
  input: string,
  schema: StringSchema,
  expectedLength: number,
) => {
  // Write:
  const iterator: Iterator = [dataView, 0];
  writeString(iterator, input, schema);
  const writeLength = iterator[1];

  // Read:
  iterator[1] = 0;
  const output = readString(iterator, schema);
  const readLength = iterator[1];

  // Assertions:
  strictEqual(output, input);
  strictEqual(writeLength, expectedLength);
  strictEqual(readLength, expectedLength);
};

describe('string', () => {
  test('()', () => {
    string('Hello, Pierre Louÿs!', {}, 22);
  });

  test('(isUnicode256 = true)', () => {
    string('Hello, Pierre Louÿs!', { isUnicode256: true }, 21);
  });

  test('(isUnicode256 = true, length = 20)', () => {
    string('Hello, Pierre Louÿs!', { isUnicode256: true, length: 20 }, 20);
  });

  test('(length = 20)', () => {
    string('Hello, Pierre Louÿs!', { length: 20 }, 21);
  });
});
