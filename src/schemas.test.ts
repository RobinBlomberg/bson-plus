import { expect, test } from 'vitest';
import { schemaFactory as $ } from './schema-factory.js';
import type { Schema, SchemaTypeValue } from './schemas.js';
import { read, write } from './schemas.js';

const BUFFER = new ArrayBuffer(256);
const VIEW = new DataView(BUFFER);

const assert = <ThisSchema extends Schema>(
  schema: ThisSchema,
  input: SchemaTypeValue<ThisSchema>,
  expectedOutput = input,
) => {
  write({ offset: 0, view: VIEW }, schema, input);
  const output = read({ offset: 0, view: VIEW }, schema);
  expect(output).toEqual(expectedOutput);
};

test('Array', () => {
  assert($.array(), [false, true]);
  assert($.array({ elements: $.boolean() }), [false, true]);
  assert($.array({ elements: $.boolean() }), [false, true]);
  assert($.array({ length: 2 }), [false, true]);
  assert($.array({ length: 1 }), [false, true], [false]);
  assert($.array({ elements: $.boolean(), length: 1 }), [false, true], [false]);
});

test('Boolean', () => {
  assert($.boolean(), false);
  assert($.boolean(), true);
});

test('Enum', () => {
  assert($.enum(['a', 'b', 'c']), 'a');
  assert($.enum(['a', 'b', 'c']), 'b');
  assert($.enum(['a', 'b', 'c']), 'c');
  assert($.enum(['a', 'b', 'c']), 'd', null);
});

test('String', () => {
  assert($.string(), '');
  assert($.string(), 'abc');
  assert($.string({ length: 3 }), 'abc');
  assert($.string({ length: 2 }), 'ab');
});
