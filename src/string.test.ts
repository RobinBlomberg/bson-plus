import { strictEqual } from 'assert';
import { describe, test } from 'vitest';
import type { Iterator } from './iterator.js';
import type { StringSchema } from './schema.js';
import { readString, writeString } from './string.js';
import { Type } from './type.js';

const dataView = new DataView(new ArrayBuffer(32));

const string = (
  input: string,
  expectedLength: number,
  schema?: StringSchema,
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
    string('Hello, Pierre Louÿs!', 22);
  });

  test('(type = "String", length = 20)', () => {
    string('Hello, Pierre Louÿs!', 21, {
      type: Type.String,
      length: 20,
    });
  });

  test('(type = "String256")', () => {
    string('Hello, Pierre Louÿs!', 21, {
      type: Type.String256,
    });
  });

  test('(type = "String256", length = 20)', () => {
    string('Hello, Pierre Louÿs!', 20, {
      type: Type.String256,
      length: 20,
    });
  });
});
