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
}

export type ArraySchema<Element extends Schema = Schema> = {
  type: SchemaType.Array;
  length?: number;
  elements?: Element;
};

export type BooleanSchema = {
  type: SchemaType.Boolean;
};

export type EnumSchema<Value = unknown> = {
  type: SchemaType.Enum;
  values: Value[];
};

export type Schema =
  | { type: SchemaType.Array; length?: number; elements?: Schema }
  | BooleanSchema
  | EnumSchema
  | StringSchema;

export type SchemaTypeValue<ThisSchema extends Schema> =
  ThisSchema extends ArraySchema<infer Element>
    ? SchemaTypeValue<Element>[]
    : ThisSchema extends BooleanSchema
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
  schema?: ThisSchema,
): SchemaTypeValue<ThisSchema> => {
  if (schema === undefined) {
    schema = { type: readPrimitive(iterator, PrimitiveType.VLQ) } as ThisSchema;
  }
  switch (schema.type) {
    case SchemaType.Array: {
      const length =
        schema.length ?? readPrimitive(iterator, PrimitiveType.VLQ);
      const value = [];
      for (let i = 0; i < length; i++) {
        value.push(read(iterator, schema.elements));
      }
      return value as SchemaTypeValue<ThisSchema>;
    }
    case SchemaType.Boolean: {
      const value = readPrimitive(iterator, PrimitiveType.Uint8) === 1;
      return value as SchemaTypeValue<ThisSchema>;
    }
    case SchemaType.Enum: {
      const index = readPrimitive(iterator, PrimitiveType.VLQ);
      const value = schema.values[index] ?? null;
      return value as SchemaTypeValue<ThisSchema>;
    }
    case SchemaType.String: {
      const length =
        schema.length ?? readPrimitive(iterator, PrimitiveType.VLQ);
      let value = '';
      for (let i = 0; i < length; i++) {
        value += String.fromCodePoint(
          readPrimitive(iterator, PrimitiveType.VLQ),
        );
      }
      return value as SchemaTypeValue<ThisSchema>;
    }
  }
};

export const write = <ThisSchema extends Schema>(
  iterator: Iterator,
  schema: ThisSchema | undefined,
  value: SchemaTypeValue<ThisSchema>,
): number => {
  if (schema === undefined) {
    let type: SchemaType;
    switch (typeof value) {
      case 'boolean':
        type = SchemaType.Boolean;
        break;
      case 'string':
        type = SchemaType.String;
        break;
      default:
        if (Array.isArray(value)) {
          type = SchemaType.Array;
        }
        throw new TypeError(`Failed to infer schema from value: ${value}`);
    }
    w(iterator, PrimitiveType.Uint8, type);
    schema = { type } as ThisSchema;
  }
  const v = value as any;
  switch (schema.type) {
    case SchemaType.Array:
      if (schema.length === undefined) {
        w(iterator, PrimitiveType.VLQ, v.length);
      }
      for (const element of v) {
        write(iterator, schema.elements, element);
      }
      return iterator.offset;
    case SchemaType.Boolean:
      return w(iterator, PrimitiveType.Uint8, v ? 1 : 0);
    case SchemaType.Enum: {
      const index = schema.values.indexOf(v);
      return w(
        iterator,
        PrimitiveType.VLQ,
        index === -1 ? schema.values.length : index,
      );
    }
    case SchemaType.String:
      if (schema.length === undefined) {
        w(iterator, PrimitiveType.VLQ, v.length);
      }
      for (const character of v) {
        w(iterator, PrimitiveType.VLQ, character.codePointAt(0));
      }
      return iterator.offset;
  }
};
