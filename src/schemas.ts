import type { Iterator } from './iterator.js';
import {
  PrimitiveType,
  readPrimitive,
  writePrimitive as w,
} from './primitives.js';

export const enum SchemaType {
  Array,
  Bigint,
  Boolean,
  Enum,
  Number,
  Object,
  String,
  Union,
}

export type BooleanSchema = {
  type: SchemaType.Boolean;
};

export type EnumSchema<Value = unknown> = {
  type: SchemaType.Enum;
  values: Value[];
};

export type Schema = BooleanSchema | EnumSchema | StringSchema;

export type SchemaTypeValue<ThisSchema extends Schema> =
  ThisSchema extends BooleanSchema
    ? boolean
    : ThisSchema extends EnumSchema<infer Values>
      ? Values | null
      : ThisSchema extends StringSchema
        ? string
        : never;

export type StringSchema = {
  type: SchemaType.String;
  length?: number;
};

export const read = <ThisSchema extends Schema>(
  iterator: Iterator,
  schema: ThisSchema,
) => {
  switch (schema.type) {
    case SchemaType.Boolean:
      return readPrimitive(iterator, PrimitiveType.Uint8) === 1;
    case SchemaType.Enum: {
      const index = readPrimitive(iterator, PrimitiveType.VLQ);
      return schema.values[index] ?? (null as SchemaTypeValue<ThisSchema>);
    }
    case SchemaType.String: {
      const length =
        schema.length ?? readPrimitive(iterator, PrimitiveType.VLQ);
      let output = '';
      for (let i = 0; i < length; i++) {
        output += String.fromCodePoint(
          readPrimitive(iterator, PrimitiveType.VLQ),
        );
      }
      return output as SchemaTypeValue<ThisSchema>;
    }
  }
};

export const write = <ThisSchema extends Schema>(
  iterator: Iterator,
  schema: ThisSchema,
  value: SchemaTypeValue<ThisSchema>,
) => {
  switch (schema.type) {
    case SchemaType.Boolean:
      return w(iterator, PrimitiveType.Uint8, value ? 1 : 0);
    case SchemaType.Enum: {
      let index = schema.values.indexOf(value);
      if (index === -1) {
        index = schema.values.length;
      }
      return w(iterator, PrimitiveType.VLQ, index);
    }
    case SchemaType.String:
      if (schema.length === undefined) {
        iterator.offset = w(
          iterator,
          PrimitiveType.VLQ,
          (value as string).length,
        );
      }
      for (const character of value as string) {
        iterator.offset = w(
          iterator,
          PrimitiveType.VLQ,
          character.codePointAt(0)!,
        );
      }
      return iterator.offset;
  }
};
